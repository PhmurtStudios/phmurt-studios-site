/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT — Campaign Invites & Player Roles Management
   Manage campaign invitations, player membership, role assignment, and character
   mapping for a D&D campaign. DMs can generate invites, manage members, and
   assign players to party characters. Players see their role and assigned character.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const { useState, useEffect, useRef, useCallback } = React;

  // ============================================================================
  // THEME CONFIGURATION
  // ============================================================================

  const T = window.__PHMURT_THEME || {
    bg: 'var(--bg)',
    bgNav: 'var(--bg-nav)',
    bgCard: 'var(--bg-card)',
    bgHover: 'var(--bg-hover)',
    text: 'var(--text)',
    textDim: 'var(--text-dim)',
    crimson: 'var(--crimson)',
    gold: 'var(--gold)',
    border: 'var(--border)',
    ui: "'Cinzel', serif",
    heading: "'Cinzel', serif",
    body: "'Spectral', Georgia, serif"
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function formatDate(isoString) {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    const now = new Date();
    const deltaMs = now - date;
    const deltaMins = Math.round(deltaMs / 60000);

    if (deltaMins < 1) return 'just now';
    if (deltaMins < 60) return deltaMins + ' min ago';
    const deltaHrs = Math.round(deltaMins / 60);
    if (deltaHrs < 24) return deltaHrs + ' hr ago';
    const deltaDays = Math.round(deltaHrs / 24);
    if (deltaDays < 30) return deltaDays + ' days ago';
    return date.toLocaleDateString();
  }

  function formatCode(code) {
    if (!code || code.length < 6) return code;
    return code.slice(0, 3) + '-' + code.slice(3, 6) + '-' + code.slice(6);
  }

  function copyToClipboard(text) {
    if (!text) return false;
    try {
      navigator.clipboard.writeText(text).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
      return true;
    } catch (e) {
      console.error('Copy failed:', e);
      return false;
    }
  }

  // ============================================================================
  // INVITE CODE COMPONENT
  // ============================================================================

  function InviteCodeCard({ code, createdAt, uses, maxUses, onDelete, onCopy }) {
    const shareUrl = 'https://phmurtstudios.com/campaigns.html?invite=' + encodeURIComponent(code);
    const usesText = maxUses ? uses + '/' + maxUses : uses + ' uses';
    const isExpiring = maxUses && uses >= maxUses;

    return React.createElement(
      'div',
      {
        style: {
          background: T.bgCard,
          border: '1px solid ' + T.border,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: isExpiring ? 0.6 : 1,
          transition: 'opacity 0.2s'
        }
      },
      React.createElement(
        'div',
        { style: { flex: 1 } },
        React.createElement(
          'div',
          { style: { fontSize: '14px', fontWeight: 'bold', color: T.gold, marginBottom: '4px' } },
          formatCode(code)
        ),
        React.createElement(
          'div',
          { style: { fontSize: '12px', color: T.textDim, marginBottom: '6px' } },
          'Created ' + formatDate(createdAt) + ' • ' + usesText
        ),
        React.createElement(
          'div',
          { style: { fontSize: '11px', color: T.textDim, wordBreak: 'break-all' } },
          shareUrl
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '8px', marginLeft: '12px' } },
        React.createElement(
          'button',
          {
            onClick: () => onCopy && onCopy(shareUrl),
            style: {
              background: T.gold,
              color: T.bg,
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }
          },
          'Copy Link'
        ),
        React.createElement(
          'button',
          {
            onClick: () => onDelete && onDelete(),
            style: {
              background: T.bgHover,
              color: T.crimson,
              border: '1px solid ' + T.crimson,
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }
          },
          'Revoke'
        )
      )
    );
  }

  // ============================================================================
  // MEMBER CARD COMPONENT
  // ============================================================================

  function MemberCard({ member, assignedCharacter, isCurrentUser, onRoleChange, onKick, onAssignCharacter }) {
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const isOnline = member.lastSeen && Date.now() - new Date(member.lastSeen) < 300000; // 5 min

    return React.createElement(
      'div',
      {
        style: {
          background: T.bgCard,
          border: '1px solid ' + T.border,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      },
      React.createElement(
        'div',
        { style: { flex: 1 } },
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' } },
          React.createElement(
            'div',
            { style: { width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#4ade80' : T.textDim } }
          ),
          React.createElement(
            'div',
            { style: { fontSize: '14px', fontWeight: 'bold', color: T.text } },
            member.name || member.email || 'Unknown'
          ),
          React.createElement(
            'div',
            {
              style: {
                fontSize: '11px',
                background: member.role === 'dm' ? T.crimson : T.gold,
                color: T.bg,
                padding: '2px 6px',
                borderRadius: '3px',
                fontWeight: 'bold',
                position: 'relative'
              }
            },
            member.role.toUpperCase()
          )
        ),
        React.createElement(
          'div',
          { style: { fontSize: '12px', color: T.textDim } },
          assignedCharacter ? 'Playing: ' + assignedCharacter : 'Not assigned'
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '8px', marginLeft: '12px' } },
        onRoleChange && !isCurrentUser
          ? React.createElement(
              'button',
              {
                onClick: () => setShowRoleMenu(!showRoleMenu),
                style: {
                  background: T.bgHover,
                  color: T.text,
                  border: '1px solid ' + T.border,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  position: 'relative'
                }
              },
              'Role',
              showRoleMenu
                ? React.createElement(
                    'div',
                    {
                      style: {
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        marginTop: '4px',
                        background: T.bgCard,
                        border: '1px solid ' + T.border,
                        borderRadius: '4px',
                        minWidth: '100px',
                        zIndex: 100
                      }
                    },
                    ['dm', 'player', 'spectator'].map(role =>
                      React.createElement(
                        'button',
                        {
                          key: role,
                          onClick: () => {
                            onRoleChange(role);
                            setShowRoleMenu(false);
                          },
                          style: {
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: member.role === role ? T.bgHover : 'transparent',
                            color: T.text,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            borderBottom: role !== 'spectator' ? '1px solid ' + T.border : 'none'
                          }
                        },
                        role.charAt(0).toUpperCase() + role.slice(1)
                      )
                    )
                  )
                : null
            )
          : null,
        onAssignCharacter
          ? React.createElement(
              'button',
              {
                onClick: onAssignCharacter,
                style: {
                  background: T.bgHover,
                  color: T.text,
                  border: '1px solid ' + T.border,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }
              },
              'Assign'
            )
          : null,
        onKick
          ? React.createElement(
              'button',
              {
                onClick: () => {
                  if (confirm('Remove this player from the campaign?')) {
                    onKick();
                  }
                },
                style: {
                  background: T.bgHover,
                  color: T.crimson,
                  border: '1px solid ' + T.crimson,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }
              },
              'Remove'
            )
          : null
      )
    );
  }

  // ============================================================================
  // MAIN CAMPAIGN INVITES VIEW
  // ============================================================================

  function CampaignInvitesView({ data, setData, viewRole, campaignId }) {
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [inviteCodes, setInviteCodes] = useState([]);
    const [copiedUrl, setCopiedUrl] = useState(null);
    const [assigningPlayerId, setAssigningPlayerId] = useState(null);
    const [error, setError] = useState(null);
    const saveTimerRef = useRef(null);

    // Ensure invites data structure exists
    useEffect(() => {
      if (!data.invites) {
        setData(prev => ({
          ...prev,
          invites: {
            playerAssignments: {},
            invitedPlayers: [],
            memberRoles: {},
            inviteHistory: []
          }
        }));
      }
    }, []);

    // Load campaign members and invites on mount + subscribe to Realtime
    const realtimeRef = useRef(null);

    useEffect(() => {
      if (!campaignId || !window.PhmurtDB) return;

      const loadData = async () => {
        try {
          setLoading(true);
          const [membersData, codesData] = await Promise.all([
            window.PhmurtDB.getCampaignMembers(campaignId),
            window.PhmurtDB.getInviteCodes(campaignId)
          ]);

          setMembers(Array.isArray(membersData) ? membersData : []);
          setInviteCodes(Array.isArray(codesData) ? codesData : []);
          setError(null);
        } catch (err) {
          console.error('Failed to load campaign data:', err);
          setError('Failed to load campaign data');
        } finally {
          setLoading(false);
        }
      };

      loadData();

      // Subscribe to Realtime updates for live member changes
      if (window.PhmurtDB.subscribeToCampaign) {
        realtimeRef.current = window.PhmurtDB.subscribeToCampaign(campaignId, function (campaignData, memberEvent) {
          if (memberEvent && memberEvent.type === 'members') {
            // Re-fetch members on any membership change
            window.PhmurtDB.getCampaignMembers(campaignId).then(function (m) {
              setMembers(Array.isArray(m) ? m : []);
            });
          }
        });
      }

      return () => {
        if (realtimeRef.current && window.PhmurtDB.unsubscribeFromCampaign) {
          window.PhmurtDB.unsubscribeFromCampaign(realtimeRef.current);
          realtimeRef.current = null;
        }
      };
    }, [campaignId]);

    // Auto-save debounced
    useEffect(() => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        setData(prev => ({
          ...prev,
          invites: {
            playerAssignments: prev.invites?.playerAssignments || {},
            invitedPlayers: prev.invites?.invitedPlayers || [],
            memberRoles: prev.invites?.memberRoles || {},
            inviteHistory: prev.invites?.inviteHistory || []
          }
        }));
      }, 500);

      return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }, [data.invites]);

    // Generate new invite code (DM only)
    const generateInvite = useCallback(async () => {
      if (!window.PhmurtDB || !campaignId) return;

      try {
        setLoading(true);
        const result = await window.PhmurtDB.createInviteCode(campaignId);
        if (result && result.code) {
          setInviteCodes(prev => [result, ...prev]);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to create invite code:', err);
        setError('Failed to create invite code');
      } finally {
        setLoading(false);
      }
    }, [campaignId]);

    // Delete invite code (DM only)
    const deleteInvite = useCallback(async (inviteId) => {
      if (!window.PhmurtDB) return;

      try {
        await window.PhmurtDB.deleteInviteCode(inviteId);
        setInviteCodes(prev => prev.filter(c => c.id !== inviteId));
        setError(null);
      } catch (err) {
        console.error('Failed to delete invite code:', err);
        setError('Failed to delete invite code');
      }
    }, []);

    // Update member role (DM only) — persist to Supabase
    const updateMemberRole = useCallback(async (userId, newRole) => {
      if (!window.PhmurtDB || !campaignId) return;
      try {
        const ok = await window.PhmurtDB.updateMemberRole(campaignId, userId, newRole);
        if (ok) {
          // Update local members list
          setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role: newRole } : m));
          // Also store in campaign data for offline reference
          setData(prev => {
            const roles = { ...prev.invites?.memberRoles };
            roles[userId] = newRole;
            return { ...prev, invites: { ...prev.invites, memberRoles: roles } };
          });
        } else {
          setError('Failed to update role');
        }
      } catch (err) {
        console.error('Failed to update member role:', err);
        setError('Failed to update role');
      }
    }, [campaignId]);

    // Kick/remove member from campaign (DM only) — persist to Supabase
    const kickMember = useCallback(async (userId) => {
      if (!window.PhmurtDB || !campaignId) return;
      try {
        const ok = await window.PhmurtDB.removeCampaignMember(campaignId, userId);
        if (ok) {
          setMembers(prev => prev.filter(m => m.user_id !== userId));
          // Remove from assignments too
          setData(prev => {
            const assignments = { ...prev.invites?.playerAssignments };
            delete assignments[userId];
            const roles = { ...prev.invites?.memberRoles };
            delete roles[userId];
            return { ...prev, invites: { ...prev.invites, playerAssignments: assignments, memberRoles: roles } };
          });
          setError(null);
        } else {
          setError('Failed to remove player');
        }
      } catch (err) {
        console.error('Failed to kick member:', err);
        setError('Failed to remove player');
      }
    }, [campaignId]);

    // Assign player to character (DM only)
    const assignPlayerToCharacter = useCallback((playerId, characterId, characterName) => {
      setData(prev => {
        const assignments = { ...prev.invites?.playerAssignments };
        assignments[playerId] = {
          characterId,
          characterName,
          role: 'player'
        };
        return {
          ...prev,
          invites: {
            ...prev.invites,
            playerAssignments: assignments
          }
        };
      });
      setAssigningPlayerId(null);
    }, []);

    // Copy URL to clipboard
    const handleCopyUrl = useCallback((url) => {
      if (copyToClipboard(url)) {
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
      }
    }, []);

    // Get assigned character name for a player
    const getAssignedCharacter = useCallback((userId) => {
      const assignment = data.invites?.playerAssignments?.[userId];
      return assignment?.characterName || null;
    }, [data.invites]);

    // Get party members for assignment selector
    const getPartyMembers = useCallback(() => {
      return (data.party || []).map(p => ({
        id: p.id,
        name: p.name || 'Unnamed'
      }));
    }, [data.party]);

    // Current user ID (from auth if available)
    const currentUserId = window.PhmurtDB?.getSession?.()?.user?.id;

    const isDm = viewRole === 'dm';
    const partyMembers = getPartyMembers();
    const inviteCode = inviteCodes.length > 0 ? inviteCodes[0].invite_code || inviteCodes[0].code : null;

    // ========================================================================
    // RENDER
    // ========================================================================

    return React.createElement(
      'div',
      {
        style: {
          background: T.bg,
          color: T.text,
          fontFamily: T.body,
          padding: '20px',
          minHeight: '100vh'
        }
      },
      // Header
      React.createElement(
        'div',
        { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid ' + T.border } },
        React.createElement(
          'h1',
          { style: { fontFamily: T.heading, fontSize: '32px', marginBottom: '8px' } },
          'Campaign Invites & Players'
        ),
        React.createElement(
          'div',
          { style: { fontSize: '14px', color: T.textDim } },
          'Manage campaign membership, invitations, and player character assignments.'
        )
      ),

      // Error message
      error
        ? React.createElement(
            'div',
            {
              style: {
                background: T.crimson,
                color: T.bg,
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }
            },
            error
          )
        : null,

      // Loading state
      loading
        ? React.createElement(
            'div',
            {
              style: {
                textAlign: 'center',
                padding: '40px 20px',
                color: T.textDim,
                fontSize: '14px'
              }
            },
            'Loading campaign data...'
          )
        : null,

      !loading
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' } },
            // ====================================================================
            // LEFT COLUMN: MEMBERS LIST
            // ====================================================================
            React.createElement(
              'div',
              null,
              React.createElement(
                'h2',
                { style: { fontFamily: T.heading, fontSize: '20px', marginBottom: '16px' } },
                'Campaign Members'
              ),
              React.createElement(
                'div',
                { style: { fontSize: '12px', color: T.textDim, marginBottom: '16px' } },
                members.length + ' member' + (members.length !== 1 ? 's' : '')
              ),

              members.length === 0
                ? React.createElement(
                    'div',
                    {
                      style: {
                        background: T.bgCard,
                        border: '1px solid ' + T.border,
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        color: T.textDim
                      }
                    },
                    'No members yet. Share an invite link to add players.'
                  )
                : members.map(member =>
                    React.createElement(MemberCard, {
                      key: member.user_id,
                      member: {
                        name: member.profiles?.name || member.profiles?.email || 'Unknown',
                        email: member.profiles?.email || '',
                        role: member.role,
                        lastSeen: member.joined_at
                      },
                      assignedCharacter: getAssignedCharacter(member.user_id),
                      isCurrentUser: member.user_id === currentUserId,
                      onRoleChange: isDm ? role => updateMemberRole(member.user_id, role) : null,
                      onKick: isDm && !member.isCurrentUser ? () => kickMember(member.user_id) : null,
                      onAssignCharacter: isDm ? () => setAssigningPlayerId(member.user_id) : null
                    })
                  )
            ),

            // ====================================================================
            // RIGHT COLUMN: INVITE MANAGEMENT (DM) or INFO (PLAYER)
            // ====================================================================
            isDm
              ? React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'div',
                    { style: { marginBottom: '30px' } },
                    React.createElement(
                      'h2',
                      { style: { fontFamily: T.heading, fontSize: '20px', marginBottom: '16px' } },
                      'Invite Links'
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: generateInvite,
                        disabled: loading,
                        style: {
                          background: T.gold,
                          color: T.bg,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          marginBottom: '16px',
                          opacity: loading ? 0.6 : 1
                        }
                      },
                      'Generate New Invite'
                    ),

                    inviteCodes.length === 0
                      ? React.createElement(
                          'div',
                          {
                            style: {
                              background: T.bgCard,
                              border: '1px solid ' + T.border,
                              borderRadius: '8px',
                              padding: '20px',
                              textAlign: 'center',
                              color: T.textDim
                            }
                          },
                          'No active invites. Create one to share with players.'
                        )
                      : inviteCodes.map(code =>
                          React.createElement(InviteCodeCard, {
                            key: code.id,
                            code: code.invite_code || code.code,
                            createdAt: code.created_at,
                            uses: code.uses || 0,
                            maxUses: code.max_uses,
                            onDelete: () => deleteInvite(code.id),
                            onCopy: handleCopyUrl
                          })
                        )
                  ),

                  React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'h2',
                      { style: { fontFamily: T.heading, fontSize: '20px', marginBottom: '16px' } },
                      'Assign Players to Characters'
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '12px', color: T.textDim, marginBottom: '16px' } },
                      'Drag and drop or click Assign to link players to party members.'
                    ),

                    partyMembers.length === 0
                      ? React.createElement(
                          'div',
                          {
                            style: {
                              background: T.bgCard,
                              border: '1px solid ' + T.border,
                              borderRadius: '8px',
                              padding: '20px',
                              textAlign: 'center',
                              color: T.textDim
                            }
                          },
                          'No party members defined. Create characters in the Party section.'
                        )
                      : partyMembers.map(char =>
                          React.createElement(
                            'div',
                            {
                              key: char.id,
                              style: {
                                background: T.bgCard,
                                border: '1px solid ' + T.border,
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginBottom: '12px'
                              }
                            },
                            React.createElement(
                              'div',
                              { style: { fontSize: '14px', fontWeight: 'bold', color: T.gold } },
                              char.name
                            ),
                            React.createElement(
                              'div',
                              { style: { fontSize: '12px', color: T.textDim, marginTop: '4px' } },
                              Object.values(data.invites?.playerAssignments || {}).some(
                                a => a.characterId === char.id
                              )
                                ? 'Assigned'
                                : 'Unassigned'
                            )
                          )
                        )
                    )
                  )
              : React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'h2',
                    { style: { fontFamily: T.heading, fontSize: '20px', marginBottom: '16px' } },
                    'Your Character'
                  ),
                  React.createElement(
                    'div',
                    {
                      style: {
                        background: T.bgCard,
                        border: '1px solid ' + T.border,
                        borderRadius: '8px',
                        padding: '16px'
                      }
                    },
                    React.createElement(
                      'div',
                      { style: { fontSize: '14px', color: T.textDim, marginBottom: '8px' } },
                      'Your Role'
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '16px', fontWeight: 'bold', color: T.gold, marginBottom: '16px' } },
                      viewRole.charAt(0).toUpperCase() + viewRole.slice(1)
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '14px', color: T.textDim, marginBottom: '8px' } },
                      'Assigned Character'
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '16px', fontWeight: 'bold', color: T.gold } },
                      getAssignedCharacter(currentUserId) || 'Not assigned'
                    )
                  )
                )
            ),

            // ====================================================================
            // CHARACTER ASSIGNMENT PICKER MODAL
            // ====================================================================
            assigningPlayerId
              ? React.createElement(
                  'div',
                  {
                    style: {
                      position: 'fixed',
                      inset: 0,
                      zIndex: 9000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px'
                    }
                  },
                  React.createElement('div', {
                    style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' },
                    onClick: () => setAssigningPlayerId(null)
                  }),
                  React.createElement(
                    'div',
                    {
                      style: {
                        position: 'relative',
                        background: T.bgCard,
                        border: '1px solid ' + T.border,
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        zIndex: 1
                      }
                    },
                    React.createElement(
                      'h3',
                      { style: { fontFamily: T.heading, fontSize: '16px', marginBottom: '16px', color: T.text } },
                      'Assign to Character'
                    ),
                    React.createElement(
                      'div',
                      { style: { fontSize: '12px', color: T.textDim, marginBottom: '12px' } },
                      'Pick a party member to assign to this player.'
                    ),
                    partyMembers.length === 0
                      ? React.createElement('div', { style: { color: T.textDim, fontStyle: 'italic', padding: '12px 0' } }, 'No party members. Add characters in the Dashboard first.')
                      : partyMembers.map(char =>
                          React.createElement(
                            'button',
                            {
                              key: char.id,
                              onClick: () => assignPlayerToCharacter(assigningPlayerId, char.id, char.name),
                              style: {
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 14px',
                                marginBottom: '6px',
                                background: T.bgHover,
                                border: '1px solid ' + T.border,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: T.text,
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'border-color 0.15s'
                              }
                            },
                            char.name,
                            React.createElement(
                              'span',
                              { style: { fontSize: '11px', color: T.textDim, fontWeight: 'normal', marginLeft: '8px' } },
                              Object.values(data.invites?.playerAssignments || {}).some(a => a.characterId === char.id) ? '(already assigned)' : ''
                            )
                          )
                        ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => setAssigningPlayerId(null),
                        style: {
                          marginTop: '12px',
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid ' + T.border,
                          borderRadius: '4px',
                          color: T.textDim,
                          fontSize: '12px',
                          cursor: 'pointer'
                        }
                      },
                      'Cancel'
                    )
                  )
                )
              : null
            )
        : null
    );
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================

  window.CampaignInvitesView = CampaignInvitesView;
})();
