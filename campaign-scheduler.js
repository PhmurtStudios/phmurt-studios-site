/**
 * Campaign Session Scheduler
 * Self-contained session scheduling system with player availability management
 * Finds optimal play times and tracks campaign history
 *
 * v2 (2026-04-21):
 *   • Fixed UTC/local timezone mismatch in findOptimalSlots (dateStr now matches getDay())
 *   • getUpcoming() no longer mutates stored sessions
 *   • _sessionCounter is auto-reconciled against existing session ids on deserialize
 *   • findOptimalSlots() accepts {granularity, startHour, endHour} to control slot density
 *   • Multi-day blackout ranges supported (exception.endDate)
 *   • RSVP tracking: setRSVP / getRSVPCounts
 *   • Calendar view: getCalendar(daysAhead)
 *   • Removal helpers: removeSession, removePlayer
 *   • Quick summary: summarize()
 */

(function() {
  'use strict';

  // ============================================================================
  // AVAILABILITY PRESETS
  // ============================================================================

  const AVAILABILITY_PRESETS = {
    weekday_evenings: {
      name: 'Weekday Evenings',
      description: 'Monday-Friday 6 PM - 11 PM',
      recurring: [
        { dayOfWeek: 1, startHour: 18, endHour: 23 }, // Mon
        { dayOfWeek: 2, startHour: 18, endHour: 23 }, // Tue
        { dayOfWeek: 3, startHour: 18, endHour: 23 }, // Wed
        { dayOfWeek: 4, startHour: 18, endHour: 23 }, // Thu
        { dayOfWeek: 5, startHour: 18, endHour: 23 }  // Fri
      ],
      exceptions: []
    },
    weekend_afternoons: {
      name: 'Weekend Afternoons',
      description: 'Saturday-Sunday 12 PM - 6 PM',
      recurring: [
        { dayOfWeek: 6, startHour: 12, endHour: 18 }, // Sat
        { dayOfWeek: 0, startHour: 12, endHour: 18 }  // Sun
      ],
      exceptions: []
    },
    weekend_evenings: {
      name: 'Weekend Evenings',
      description: 'Saturday-Sunday 5 PM - 11 PM',
      recurring: [
        { dayOfWeek: 6, startHour: 17, endHour: 23 }, // Sat
        { dayOfWeek: 0, startHour: 17, endHour: 23 }  // Sun
      ],
      exceptions: []
    },
    flexible: {
      name: 'Flexible',
      description: 'All times available',
      recurring: [
        { dayOfWeek: 0, startHour: 0, endHour: 24 },
        { dayOfWeek: 1, startHour: 0, endHour: 24 },
        { dayOfWeek: 2, startHour: 0, endHour: 24 },
        { dayOfWeek: 3, startHour: 0, endHour: 24 },
        { dayOfWeek: 4, startHour: 0, endHour: 24 },
        { dayOfWeek: 5, startHour: 0, endHour: 24 },
        { dayOfWeek: 6, startHour: 0, endHour: 24 }
      ],
      exceptions: []
    },
    friday_night: {
      name: 'Friday Night',
      description: 'Friday 7 PM - 12 AM',
      recurring: [
        { dayOfWeek: 5, startHour: 19, endHour: 24 }
      ],
      exceptions: []
    }
  };

  // ============================================================================
  // HELPERS
  // ============================================================================

  /** Local YYYY-MM-DD (does NOT shift by UTC offset). */
  function _localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function _hh(h) { return `${String(h).padStart(2, '0')}:00`; }

  function _parseHourFromTime(t) {
    if (typeof t !== 'string') return 0;
    const parts = t.split(':');
    const h = parseInt(parts[0], 10);
    return Number.isFinite(h) ? h : 0;
  }

  // ============================================================================
  // SESSIONSCHEDULER CLASS
  // ============================================================================

  class SessionScheduler {
    constructor() {
      this.players = new Map();
      this.sessions = [];
      this._sessionCounter = 0;
      this._createdAt = new Date().toISOString();
    }

    /**
     * Set player availability
     * @param {string} playerId - Unique player identifier
     * @param {object} availability - { recurring: [{dayOfWeek(0-6), startHour, endHour}],
     *                                   exceptions: [{date, endDate?, available, startHour?, endHour?}] }
     */
    setPlayerAvailability(playerId, availability) {
      if (!playerId) {
        throw new Error('Player ID is required');
      }
      if (!availability || typeof availability !== 'object') {
        throw new Error('Availability must be an object');
      }

      // Validate recurring slots
      if (availability.recurring && Array.isArray(availability.recurring)) {
        for (const slot of availability.recurring) {
          if (!slot || typeof slot !== 'object') {
            throw new Error('Recurring slot must be an object');
          }
          if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
            throw new Error(`Invalid dayOfWeek: ${slot.dayOfWeek}`);
          }
          if (slot.startHour < 0 || slot.startHour > 23 || slot.endHour < 0 || slot.endHour > 24) {
            throw new Error(`Invalid hours: ${slot.startHour}-${slot.endHour}`);
          }
          if (slot.startHour >= slot.endHour) {
            throw new Error(`startHour must be < endHour (got ${slot.startHour}-${slot.endHour})`);
          }
        }
      }

      // Validate exceptions
      if (availability.exceptions && Array.isArray(availability.exceptions)) {
        for (const ex of availability.exceptions) {
          if (!ex || typeof ex !== 'object' || !ex.date) {
            throw new Error('Exception requires a date');
          }
        }
      }

      const player = this.players.get(playerId) || { id: playerId, name: playerId, email: null };
      player.availability = {
        recurring: availability.recurring || [],
        exceptions: availability.exceptions || []
      };

      this.players.set(playerId, player);
    }

    /**
     * Set player metadata (name, email)
     */
    setPlayerMetadata(playerId, metadata) {
      const player = this.players.get(playerId) || { id: playerId, name: playerId, email: null, availability: { recurring: [], exceptions: [] } };

      if (metadata && metadata.name) player.name = metadata.name;
      if (metadata && metadata.email) player.email = metadata.email;

      this.players.set(playerId, player);
    }

    /** Remove a player and clear their attendance/RSVPs. */
    removePlayer(playerId) {
      const existed = this.players.delete(playerId);
      if (existed) {
        for (const s of this.sessions) {
          if (Array.isArray(s.attendees)) {
            s.attendees = s.attendees.filter(id => id !== playerId);
          }
          if (s.rsvps && typeof s.rsvps === 'object') {
            delete s.rsvps[playerId];
          }
        }
      }
      return existed;
    }

    /**
     * Find optimal time slots when players overlap.
     * @param {number} minPlayers - Minimum players required (default: all players)
     * @param {number} durationHours - Session duration in hours
     * @param {number} daysAhead - Look this many days into the future (default: 30)
     * @param {object} [opts] - { granularity: hours-step (default 1), startHour: 0, endHour: 24 }
     * @returns {array} Sorted list of {date, startTime, endTime, dayOfWeek, availablePlayers[], missingPlayers[], availableCount}
     */
    findOptimalSlots(minPlayers = this.players.size, durationHours = 4, daysAhead = 30, opts = {}) {
      if (this.players.size === 0) {
        return [];
      }

      minPlayers = Math.max(1, Math.min(minPlayers, this.players.size));
      durationHours = Math.max(1, Math.min(durationHours, 24));
      daysAhead = Math.max(1, Math.min(daysAhead, 365));

      const granularity = Math.max(1, Math.min(parseInt(opts.granularity, 10) || 1, durationHours));
      const dayStart = Math.max(0, Math.min(parseInt(opts.startHour, 10) || 0, 23));
      const dayEnd = Math.max(dayStart + durationHours, Math.min(parseInt(opts.endHour, 10) || 24, 24));

      const slots = [];
      const now = new Date();

      for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
        const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
        const dayOfWeek = slotDate.getDay();
        const dateStr = _localDateStr(slotDate);

        for (let hour = dayStart; hour <= dayEnd - durationHours; hour += granularity) {
          const startTime = hour;
          const endTime = hour + durationHours;

          const availablePlayers = [];
          const missingPlayers = [];

          for (const [playerId, player] of this.players) {
            if (this._isPlayerAvailable(player, dateStr, dayOfWeek, startTime, endTime)) {
              availablePlayers.push(playerId);
            } else {
              missingPlayers.push(playerId);
            }
          }

          if (availablePlayers.length >= minPlayers) {
            slots.push({
              date: dateStr,
              startTime: _hh(startTime),
              endTime: _hh(endTime),
              dayOfWeek: dayOfWeek,
              availablePlayers: availablePlayers,
              missingPlayers: missingPlayers,
              availableCount: availablePlayers.length
            });
          }
        }
      }

      slots.sort((a, b) => {
        if (b.availableCount !== a.availableCount) return b.availableCount - a.availableCount;
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });

      return slots;
    }

    /**
     * Schedule a session for a specific date/time
     */
    scheduleSession(date, startTime, endTime, options = {}) {
      // Defensive: ensure counter is past any existing manual ids before allocating.
      this._reconcileCounter();
      const session = {
        id: ++this._sessionCounter,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: 'scheduled',
        attendees: options.attendees || Array.from(this.players.keys()),
        rsvps: {},                           // playerId → "yes"|"no"|"maybe"
        notes: options.notes || '',
        recap: null,
        createdAt: new Date().toISOString()
      };

      this.sessions.push(session);
      return session;
    }

    /**
     * Cancel a scheduled session
     */
    cancelSession(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      const wasStatus = session.status;
      session.status = 'cancelled';
      session.cancelledAt = new Date().toISOString();

      return {
        sessionId: sessionId,
        previousStatus: wasStatus,
        message: `Session ${sessionId} cancelled`,
        attendees: session.attendees
      };
    }

    /** Remove a session entirely (vs. cancelling). */
    removeSession(sessionId) {
      const before = this.sessions.length;
      this.sessions = this.sessions.filter(s => s.id !== sessionId);
      return this.sessions.length !== before;
    }

    /**
     * Mark a session as complete and store recap
     */
    completeSession(sessionId, recap = '') {
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      session.status = 'completed';
      session.recap = recap;
      session.completedAt = new Date().toISOString();

      return session;
    }

    /**
     * Set a player's RSVP for a session.
     * @param {number} sessionId
     * @param {string} playerId
     * @param {"yes"|"no"|"maybe"} response
     */
    setRSVP(sessionId, playerId, response) {
      if (!['yes', 'no', 'maybe'].includes(response)) {
        throw new Error('Response must be "yes", "no", or "maybe"');
      }
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) throw new Error(`Session not found: ${sessionId}`);
      if (!session.rsvps || typeof session.rsvps !== 'object') session.rsvps = {};
      session.rsvps[playerId] = response;
      return session.rsvps;
    }

    getRSVPCounts(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId);
      if (!session) return { yes: 0, no: 0, maybe: 0, pending: 0 };
      const rsvps = session.rsvps || {};
      const counts = { yes: 0, no: 0, maybe: 0, pending: 0 };
      const expected = Array.isArray(session.attendees) && session.attendees.length
        ? session.attendees
        : Array.from(this.players.keys());
      for (const pid of expected) {
        const r = rsvps[pid];
        if (r === 'yes' || r === 'no' || r === 'maybe') counts[r]++;
        else counts.pending++;
      }
      return counts;
    }

    /**
     * Get upcoming scheduled sessions (returns FRESH objects; does not mutate stored data).
     */
    getUpcoming() {
      const now = new Date();
      const upcoming = this.sessions
        .filter(s => s.status === 'scheduled')
        .map(session => {
          const sessionDate = new Date(`${session.date}T${session.startTime}:00`);
          const diff = sessionDate - now;
          return Object.assign({}, session, {
            daysUntil: Math.ceil(diff / 86400000),
            hoursUntil: Math.ceil(diff / 3600000),
            isPast: diff < 0,
            rsvpCounts: this.getRSVPCounts(session.id)
          });
        })
        .sort((a, b) => {
          const aDate = new Date(`${a.date}T${a.startTime}:00`);
          const bDate = new Date(`${b.date}T${b.startTime}:00`);
          return aDate - bDate;
        });

      return upcoming;
    }

    /**
     * Get session history with recaps
     */
    getSessionHistory() {
      return this.sessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => {
          const aDate = new Date(`${a.date}T${a.startTime}:00`);
          const bDate = new Date(`${b.date}T${b.startTime}:00`);
          return bDate - aDate; // Most recent first
        });
    }

    /**
     * Calculate per-player attendance rate
     */
    getAttendanceStats() {
      const stats = {};
      for (const [playerId, player] of this.players) {
        stats[playerId] = {
          playerId: playerId,
          name: player.name,
          attended: 0,
          total: 0,
          rate: 0
        };
      }

      for (const session of this.sessions) {
        if (session.status === 'completed') {
          for (const playerId of Object.keys(stats)) {
            stats[playerId].total++;
          }
          for (const attendee of (session.attendees || [])) {
            if (stats[attendee]) stats[attendee].attended++;
          }
        }
      }

      const result = Object.values(stats);
      result.forEach(s => {
        s.rate = s.total > 0 ? parseFloat((s.attended / s.total).toFixed(2)) : 0;
      });

      return result;
    }

    /**
     * Get the next available slot when all/most players can play
     */
    getNextAvailableSlot(durationHours = 4) {
      const slots = this.findOptimalSlots(this.players.size, durationHours, 90);
      return slots.length > 0 ? slots[0] : null;
    }

    /**
     * Generate recurring sessions for a specific day of week
     */
    generateRecurringSchedule(dayOfWeek, startTime, count, options = {}) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        throw new Error('dayOfWeek must be 0-6');
      }

      const duration = options.duration || 4;
      const startHour = parseInt(startTime.split(':')[0], 10);
      const endHour = Math.min(24, startHour + duration);
      const created = [];

      const today = new Date();
      let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      // Next occurrence of dayOfWeek (today if matches; pass options.skipToday to force +7)
      const offset = ((dayOfWeek - currentDate.getDay() + 7) % 7);
      const skipToday = !!options.skipToday && offset === 0;
      currentDate.setDate(currentDate.getDate() + (skipToday ? 7 : offset));

      for (let i = 0; i < count; i++) {
        const dateStr = _localDateStr(currentDate);
        const startTimeStr = _hh(startHour);
        const endTimeStr = _hh(endHour);

        const session = this.scheduleSession(dateStr, startTimeStr, endTimeStr, {
          notes: options.notes || `Session ${i + 1} of recurring schedule`,
          attendees: Array.from(this.players.keys())
        });

        created.push(session);
        currentDate.setDate(currentDate.getDate() + 7);
      }

      return created;
    }

    /**
     * Build a calendar grid for the next N days, marking each day as
     * scheduled / available / unavailable. Useful for the calendar widget.
     */
    getCalendar(daysAhead = 30, durationHours = 4) {
      const cal = [];
      const now = new Date();
      const sessionByDate = {};
      for (const s of this.sessions) {
        if (!s || !s.date) continue;
        if (!sessionByDate[s.date]) sessionByDate[s.date] = [];
        sessionByDate[s.date].push(s);
      }

      for (let i = 0; i < daysAhead; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        const ds = _localDateStr(d);
        const dow = d.getDay();
        // Count how many players have ANY availability that day.
        let availCount = 0;
        for (const [, player] of this.players) {
          if (this._dayHasAnyAvailability(player, ds, dow)) availCount++;
        }
        cal.push({
          date: ds,
          dayOfWeek: dow,
          sessions: sessionByDate[ds] || [],
          playersAvailableCount: availCount,
          totalPlayers: this.players.size
        });
      }
      return cal;
    }

    /** High-level summary for dashboards. */
    summarize() {
      const upcoming = this.sessions.filter(s => s.status === 'scheduled').length;
      const completed = this.sessions.filter(s => s.status === 'completed').length;
      const cancelled = this.sessions.filter(s => s.status === 'cancelled').length;
      const next = this.getUpcoming()[0] || null;
      return {
        players: this.players.size,
        upcoming,
        completed,
        cancelled,
        total: this.sessions.length,
        nextSession: next ? { id: next.id, date: next.date, startTime: next.startTime, daysUntil: next.daysUntil } : null,
        createdAt: this._createdAt
      };
    }

    /**
     * Serialize scheduler data
     */
    serialize() {
      const data = {
        players: Array.from(this.players.values()),
        sessions: this.sessions,
        _sessionCounter: this._sessionCounter,
        _createdAt: this._createdAt,
        _version: 2
      };
      return JSON.stringify(data, null, 2);
    }

    /**
     * Deserialize scheduler data
     */
    deserialize(jsonString) {
      try {
        const data = JSON.parse(jsonString);

        this.players.clear();
        if (data.players && Array.isArray(data.players)) {
          for (const player of data.players) {
            if (player && player.id) {
              // Backfill rsvps/availability defaults so older saves keep working.
              if (!player.availability) player.availability = { recurring: [], exceptions: [] };
              this.players.set(player.id, player);
            }
          }
        }

        this.sessions = Array.isArray(data.sessions) ? data.sessions.map(s => {
          if (s && typeof s === 'object' && !s.rsvps) s.rsvps = {};
          return s;
        }) : [];
        this._sessionCounter = Math.max(0, parseInt(data._sessionCounter, 10) || 0);
        this._createdAt = data._createdAt || new Date().toISOString();
        this._reconcileCounter();
      } catch (e) {
        throw new Error(`Deserialization failed: ${e.message}`);
      }
    }

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /** Make sure _sessionCounter is at least max(existing session ids). */
    _reconcileCounter() {
      let max = this._sessionCounter;
      for (const s of this.sessions) {
        if (s && typeof s.id === 'number' && s.id > max) max = s.id;
      }
      this._sessionCounter = max;
    }

    /**
     * Check if a player is available for a specific slot.
     * @private
     */
    _isPlayerAvailable(player, dateStr, dayOfWeek, startHour, endHour) {
      if (!player.availability) return false;

      // Exceptions override recurring. Support multi-day blackouts via endDate.
      for (const exception of (player.availability.exceptions || [])) {
        const inRange = exception.endDate
          ? (dateStr >= exception.date && dateStr <= exception.endDate)
          : (exception.date === dateStr);
        if (!inRange) continue;
        if (!exception.available) return false;
        if (exception.startHour !== undefined && exception.endHour !== undefined) {
          return startHour >= exception.startHour && endHour <= exception.endHour;
        }
        return true;
      }

      for (const slot of (player.availability.recurring || [])) {
        if (slot.dayOfWeek === dayOfWeek &&
            startHour >= slot.startHour && endHour <= slot.endHour) {
          return true;
        }
      }
      return false;
    }

    /**
     * Lighter-weight version of _isPlayerAvailable used by the calendar — just
     * "is the player available AT ALL on this day?"
     * @private
     */
    _dayHasAnyAvailability(player, dateStr, dayOfWeek) {
      if (!player.availability) return false;
      for (const exception of (player.availability.exceptions || [])) {
        const inRange = exception.endDate
          ? (dateStr >= exception.date && dateStr <= exception.endDate)
          : (exception.date === dateStr);
        if (!inRange) continue;
        return !!exception.available;
      }
      for (const slot of (player.availability.recurring || [])) {
        if (slot.dayOfWeek === dayOfWeek) return true;
      }
      return false;
    }
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================

  window.SessionScheduler = SessionScheduler;
  window.AVAILABILITY_PRESETS = AVAILABILITY_PRESETS;
})();
