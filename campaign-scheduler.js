/**
 * Campaign Session Scheduler
 * Self-contained session scheduling system with player availability management
 * Finds optimal play times and tracks campaign history
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
     * @param {object} availability - { recurring: [{dayOfWeek(0-6), startHour, endHour}], exceptions: [{date, available, startHour, endHour}] }
     */
    setPlayerAvailability(playerId, availability) {
      if (!playerId) {
        throw new Error('Player ID is required');
      }

      // Validate recurring slots
      if (availability.recurring && Array.isArray(availability.recurring)) {
        for (const slot of availability.recurring) {
          if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
            throw new Error(`Invalid dayOfWeek: ${slot.dayOfWeek}`);
          }
          if (slot.startHour < 0 || slot.startHour > 23 || slot.endHour < 0 || slot.endHour > 24) {
            throw new Error(`Invalid hours: ${slot.startHour}-${slot.endHour}`);
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
     * @param {string} playerId - Unique player identifier
     * @param {object} metadata - { name, email }
     */
    setPlayerMetadata(playerId, metadata) {
      const player = this.players.get(playerId) || { id: playerId, name: playerId, email: null, availability: { recurring: [], exceptions: [] } };

      if (metadata.name) player.name = metadata.name;
      if (metadata.email) player.email = metadata.email;

      this.players.set(playerId, player);
    }

    /**
     * Find optimal time slots when players overlap
     * @param {number} minPlayers - Minimum players required (default: all players)
     * @param {number} durationHours - Session duration in hours
     * @param {number} daysAhead - Look this many days into the future (default: 30)
     * @returns {array} Sorted list of {date, startTime, endTime, availablePlayers[], missingPlayers[], availableCount}
     */
    findOptimalSlots(minPlayers = this.players.size, durationHours = 4, daysAhead = 30) {
      if (this.players.size === 0) {
        return [];
      }

      minPlayers = Math.max(1, Math.min(minPlayers, this.players.size));
      durationHours = Math.max(1, Math.min(durationHours, 24));
      daysAhead = Math.max(1, Math.min(daysAhead, 365));

      const slots = [];
      const now = new Date();

      // Generate candidate slots for each day
      for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
        const slotDate = new Date(now);
        slotDate.setDate(slotDate.getDate() + dayOffset);

        const dayOfWeek = slotDate.getDay();
        const dateStr = slotDate.toISOString().split('T')[0];

        // Try hourly slots throughout the day
        for (let hour = 0; hour <= 24 - durationHours; hour++) {
          const startTime = hour;
          const endTime = hour + durationHours;

          let availablePlayers = [];
          let missingPlayers = [];

          // Check each player's availability
          for (const [playerId, player] of this.players) {
            if (this._isPlayerAvailable(player, dateStr, dayOfWeek, startTime, endTime)) {
              availablePlayers.push(playerId);
            } else {
              missingPlayers.push(playerId);
            }
          }

          // Only include slots meeting minimum
          if (availablePlayers.length >= minPlayers) {
            slots.push({
              date: dateStr,
              startTime: `${String(startTime).padStart(2, '0')}:00`,
              endTime: `${String(endTime).padStart(2, '0')}:00`,
              dayOfWeek: dayOfWeek,
              availablePlayers: availablePlayers,
              missingPlayers: missingPlayers,
              availableCount: availablePlayers.length
            });
          }
        }
      }

      // Sort by availability count (descending), then by date/time
      slots.sort((a, b) => {
        if (b.availableCount !== a.availableCount) {
          return b.availableCount - a.availableCount;
        }
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
      });

      return slots;
    }

    /**
     * Schedule a session for a specific date/time
     * @param {string} date - ISO date string (YYYY-MM-DD)
     * @param {string} startTime - Time in HH:00 format
     * @param {string} endTime - Time in HH:00 format
     * @param {object} options - { notes, attendees }
     * @returns {object} Session object
     */
    scheduleSession(date, startTime, endTime, options = {}) {
      const session = {
        id: ++this._sessionCounter,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: 'scheduled',
        attendees: options.attendees || Array.from(this.players.keys()),
        notes: options.notes || '',
        recap: null,
        createdAt: new Date().toISOString()
      };

      this.sessions.push(session);
      return session;
    }

    /**
     * Cancel a scheduled session
     * @param {number} sessionId - Session ID
     * @returns {object} Notification data
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

    /**
     * Mark a session as complete and store recap
     * @param {number} sessionId - Session ID
     * @param {string} recap - Session recap text
     * @returns {object} Completed session
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
     * Get upcoming scheduled sessions
     * @returns {array} Sessions with countdown info
     */
    getUpcoming() {
      const now = new Date();
      const upcoming = this.sessions.filter(s => s.status === 'scheduled');

      upcoming.forEach(session => {
        const sessionDate = new Date(`${session.date}T${session.startTime}:00`);
        const diff = sessionDate - now;
        session.daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));
        session.hoursUntil = Math.ceil(diff / (1000 * 60 * 60));
      });

      // Sort by date ascending
      upcoming.sort((a, b) => {
        const aDate = new Date(`${a.date}T${a.startTime}:00`);
        const bDate = new Date(`${b.date}T${b.startTime}:00`);
        return aDate - bDate;
      });

      return upcoming;
    }

    /**
     * Get session history with recaps
     * @returns {array} Completed sessions
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
     * @returns {array} Attendance stats: [{playerId, name, attended, total, rate}]
     */
    getAttendanceStats() {
      const stats = {};

      // Initialize for all players
      for (const [playerId, player] of this.players) {
        stats[playerId] = {
          playerId: playerId,
          name: player.name,
          attended: 0,
          total: 0,
          rate: 0
        };
      }

      // Count from completed sessions
      for (const session of this.sessions) {
        if (session.status === 'completed') {
          // Count total sessions for all registered players
          for (const playerId of Object.keys(stats)) {
            stats[playerId].total++;
          }

          // Count attendance: only players in attendees array
          for (const attendee of session.attendees) {
            if (stats[attendee]) {
              stats[attendee].attended++;
            }
          }
        }
      }

      // Calculate rates
      const result = Object.values(stats);
      result.forEach(s => {
        s.rate = s.total > 0 ? parseFloat((s.attended / s.total).toFixed(2)) : 0;
      });

      return result;
    }

    /**
     * Get the next available slot when all/most players can play
     * @param {number} durationHours - Session duration (default: 4)
     * @returns {object} Next optimal slot or null
     */
    getNextAvailableSlot(durationHours = 4) {
      const slots = this.findOptimalSlots(this.players.size, durationHours, 90);
      return slots.length > 0 ? slots[0] : null;
    }

    /**
     * Generate recurring sessions for a specific day of week
     * @param {number} dayOfWeek - 0=Sunday, 6=Saturday
     * @param {string} startTime - Time in HH:00 format
     * @param {number} count - Number of sessions to create
     * @param {object} options - { notes, duration }
     * @returns {array} Created sessions
     */
    generateRecurringSchedule(dayOfWeek, startTime, count, options = {}) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        throw new Error('dayOfWeek must be 0-6');
      }

      const duration = options.duration || 4;
      const startHour = parseInt(startTime.split(':')[0], 10);
      const endHour = Math.min(24, startHour + duration);
      const created = [];

      // Find start date (next occurrence of dayOfWeek)
      const today = new Date();
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + ((dayOfWeek - currentDate.getDay() + 7) % 7));

      // Generate sessions
      for (let i = 0; i < count; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const endTimeStr = `${String(endHour).padStart(2, '0')}:00`;
        const startTimeStr = `${String(startHour).padStart(2, '0')}:00`;

        const session = this.scheduleSession(dateStr, startTimeStr, endTimeStr, {
          notes: options.notes || `Session ${i + 1} of recurring schedule`,
          attendees: Array.from(this.players.keys())
        });

        created.push(session);

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }

      return created;
    }

    /**
     * Serialize scheduler data
     * @returns {string} JSON string of all scheduler data
     */
    serialize() {
      const data = {
        players: Array.from(this.players.values()),
        sessions: this.sessions,
        _sessionCounter: this._sessionCounter,
        _createdAt: this._createdAt
      };
      return JSON.stringify(data, null, 2);
    }

    /**
     * Deserialize scheduler data
     * @param {string} jsonString - JSON data
     */
    deserialize(jsonString) {
      try {
        const data = JSON.parse(jsonString);

        this.players.clear();
        if (data.players && Array.isArray(data.players)) {
          for (const player of data.players) {
            if (player && player.id) {
              this.players.set(player.id, player);
            }
          }
        }

        this.sessions = Array.isArray(data.sessions) ? data.sessions : [];
        this._sessionCounter = Math.max(0, parseInt(data._sessionCounter, 10) || 0);
        this._createdAt = data._createdAt || new Date().toISOString();
      } catch (e) {
        throw new Error(`Deserialization failed: ${e.message}`);
      }
    }

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /**
     * Check if a player is available for a specific slot
     * @private
     */
    _isPlayerAvailable(player, dateStr, dayOfWeek, startHour, endHour) {
      if (!player.availability) {
        return false;
      }

      // Check exceptions first (they override recurring)
      for (const exception of player.availability.exceptions) {
        if (exception.date === dateStr) {
          if (!exception.available) {
            return false;
          }
          // If exception marks available, check time
          if (exception.startHour !== undefined && exception.endHour !== undefined) {
            return startHour >= exception.startHour && endHour <= exception.endHour;
          }
          return true;
        }
      }

      // Check recurring availability
      for (const slot of player.availability.recurring) {
        if (slot.dayOfWeek === dayOfWeek) {
          // Slot must fully contain requested time
          if (startHour >= slot.startHour && endHour <= slot.endHour) {
            return true;
          }
        }
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
