/**
 * content.js — the ONE source of truth for every word in this app.
 *
 * Transcribed verbatim from the PDF "NSW Little Athletics — Under 10 Boys
 * Age Manager's Coaching Guide". Views render from this object; nothing in
 * js/views/*.js hard-codes guide copy. Fix a typo here and it is fixed
 * everywhere it appears.
 *
 * Resource shape (used by both event pages and the Full Resource Library, so
 * a URL exists exactly once):
 *   { kind: 'video',   youtubeId, title, source, note }
 *   { kind: 'article', url,       title, source, note }
 */

/*
 * `meta` is currently unrendered: it was the Home view's copy source, and
 * Home was archived (not deleted — see archive/README.md) when the app was
 * cut down to four tabs. Kept here rather than deleted because deleting
 * content from the only copy of this file is the worse error, and
 * `ageGroupFacts.source` (already rendered on the Rules tab) carries a
 * substantively equivalent provenance disclaimer to `meta.provenance`, so
 * nothing safety-relevant is lost by `meta` sitting unused. If a future pass
 * finds a home for this copy, update this comment; don't just delete it.
 */
export const meta = {
  title: 'NSW Little Athletics — Under 10 Boys',
  subtitle: "Age Manager's Coaching Guide",
  tagline:
    'Skill progressions for every event, a curated video & article library from ' +
    'Little Athletics Australia and specialist youth-athletics coaches, plus a bank ' +
    'of skills-based games to fill waiting periods.',
  pillars: [
    'Beginner → Intermediate progressions',
    'Video & article library',
    '90/10 skills-first games bank'
  ],
  provenance:
    'Compiled from official Little Athletics Australia coaching resources and ' +
    'Coaching Young Athletes (Darren Wensor). Always check the current NSW/LAA ' +
    'Rules of Competition and your own centre’s program — event offerings can ' +
    'vary slightly by centre.',
  howToUse:
    'This guide covers the standard NSW Little Athletics events most commonly ' +
    'programmed for Under 10 Boys, plus one bonus lead-up skill. For each event ' +
    'you’ll find: a quick-facts snapshot, a beginner → intermediate teaching ' +
    'progression, common faults to watch for, a safety note, and a “Watch & Learn” ' +
    'card linking to the best available video or written technique guide.'
};

/* ------------------------------------------------------------------ */
/* Shared resources — referenced by slug from events/games so that a   */
/* resource used twice (Part 2: Running Technique) is defined once.    */
/* ------------------------------------------------------------------ */

export const resources = {
  'video-standing-start': {
    kind: 'video',
    youtubeId: 'qtLAO-rgGOw',
    title: 'Coaching Video Series – Part 1: Standing Start',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Qualified coach demonstrates grip, stance and the three starting commands, ' +
      'matched to Little Athletics rules.'
  },
  'video-running-technique': {
    kind: 'video',
    youtubeId: 'nqZXwJyALyg',
    title: 'Coaching Video Series – Part 2: Running Technique',
    source: 'Little Athletics Australia (official coaching series)',
    note: 'Covers arm drive, posture and stride mechanics for beginner sprinters.'
  },
  'video-hurdles': {
    kind: 'video',
    youtubeId: '7w8iWGBmO4k',
    title: 'Coaching Video Series – Part 3: Hurdles',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Demonstrates lead-leg and trail-leg mechanics using Little Athletics hurdle ' +
      'heights and spacing.'
  },
  'video-racewalking': {
    kind: 'video',
    youtubeId: 'HY7Z07WJaNc',
    title: 'Coaching Video Series – Racewalking',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Explains the straight-leg and continuous-contact rules with visual ' +
      'demonstration.'
  },
  'video-long-jump': {
    kind: 'video',
    youtubeId: 'DoC6HAlK8mc',
    title: 'Coaching Video Series – Part 5: Long Jump',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Covers the mat take-off method used at U9–10 level, run-up and landing ' +
      'technique.'
  },
  'video-high-jump': {
    kind: 'video',
    youtubeId: 'U6WcNbUHK6I',
    title: 'Coaching Video Series – Part 7: High Jump',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Demonstrates the scissor technique and the legal-jump rules that apply ' +
      'through to U10.'
  },
  'video-shot-put': {
    kind: 'video',
    youtubeId: '55P_AgPJoWM',
    title: 'Coaching Video Series – Part 9: Shot Put',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Shows the standing put technique, grip and safe circle conduct used at ' +
      'Little Athletics level.'
  },
  'video-discus': {
    kind: 'video',
    youtubeId: 'vDlUI5CHPjk',
    title: 'Coaching Video Series – Part 11: Discus',
    source: 'Little Athletics Australia (official coaching series)',
    note: 'Demonstrates grip, stance and the standing throw used at this age group.'
  },
  'video-javelin': {
    kind: 'video',
    youtubeId: 'Sz3WRSoZW2c',
    title: 'Coaching Video Series – Part 10: Javelin',
    source: 'Little Athletics Australia (official coaching series)',
    note:
      'Full javelin technique for reference — use only the overarm throwing action ' +
      'and adapt it to a turbo jav for this age group.'
  },

  'article-relay-changes': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2016/10/27/how-to-teach-kids-circular-relay-baton-changes/',
    title: 'How to Teach Kids Circular Relay Baton Changes',
    source: 'Darren Wensor, Coaching Young Athletes',
    note:
      'A full 30–40 minute session plan, from stationary passes through to ' +
      'full-speed changeovers, written specifically for youth/Little Athletics groups.'
  },
  'article-long-jump-run-up': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2015/08/10/how-to-teach-a-long-jump-run-up-in-7-easy-steps/',
    title: 'How to Teach a Long Jump Run-Up in 7 Easy Steps',
    source: 'Darren Wensor, Coaching Young Athletes',
    note: 'A simple, age-based method for measuring and marking a repeatable run-up.'
  },
  'article-scissors-high-jump': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2019/12/08/how-to-teach-kids-to-scissors-high-jump/',
    title: 'How To Teach Kids To Scissors High Jump',
    source: 'Darren Wensor, Coaching Young Athletes',
    note:
      'A step-by-step beginner progression – no-bar, to flexi-bar, to real bar – ' +
      'plus common mistakes to watch for.'
  },
  'article-shot-put': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2017/05/29/how-to-teach-shot-put-to-young-athletes/',
    title: 'How to Teach Shot Put to Young Athletes',
    source: 'Darren Wensor, Coaching Young Athletes',
    note:
      'A ready-to-run group session plan, including cues for common beginner grip ' +
      'and stance errors.'
  },
  'article-discus': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2017/06/26/how-to-teach-discus-to-young-athletes/',
    title: 'How to Teach Discus to Young Athletes',
    source: 'Darren Wensor, Coaching Young Athletes',
    note:
      'The “discus sandwich” teaching sequence for groups, from grip through to a ' +
      'full standing throw.'
  },
  'article-3-words': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2015/09/21/coaching-kids-3-important-words-of-advice/',
    title: 'Coaching Kids? 3 Important Words of Advice',
    source: 'Darren Wensor, Coaching Young Athletes',
    note:
      'Background reading on why games matter more than drills for keeping large ' +
      'groups engaged during long waits between turns.'
  },
  'article-throwing-game': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2019/02/25/an-athletics-throwing-game-that-kids-will-love/',
    title: 'An Athletics Throwing Game That Kids Will Love',
    source: 'Coaching Young Athletes',
    note: 'The source game that Target Hoops is adapted from.'
  },
  'article-relay-games': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2020/04/20/3-of-the-best-relay-baton-games-for-athletics/',
    title: '3 Of The Best Relay Baton Games For Athletics',
    source: 'Coaching Young Athletes',
    note: 'The source collection that Baton Down the Line comes from.'
  },
  'article-hurdles-shuttle': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/2015/07/08/games-that-kids-love-the-hurdles-shuttle-relay/',
    title: 'Games That Kids Love: The Hurdles Shuttle Relay',
    source: 'Coaching Young Athletes',
    note: 'The source game for the Hurdles Shuttle Relay.'
  },
  'article-laa-video-hub': {
    kind: 'article',
    url: 'https://www.littleathletics.com.au/education-training/video-resources/coaching-video-resources/',
    title: 'Little Athletics Australia — full Coaching Video hub',
    source: 'Little Athletics Australia',
    note: 'Every video in the official coaching series, in one place.'
  },
  'article-laa-rules': {
    kind: 'article',
    url: 'https://www.littleathletics.com.au/wp-content/uploads/2024/08/LAA-Standard-Rules-for-Competition-July-2024_V2.pdf',
    title: 'LAA Standard Rules for Competition (current edition)',
    source: 'Little Athletics Australia',
    note: 'The rulebook every fact on this page is drawn from (PDF).'
  },
  'article-cya-blog': {
    kind: 'article',
    url: 'https://coachingyoungathletes.com/',
    title: 'Coaching Young Athletes — full blog',
    source: 'Darren Wensor',
    note: 'The complete archive of youth-athletics coaching articles.'
  }
};

/* ------------------------------------------------------------------ */
/* Under 10 Age Group, at a Glance (PDF page 3)                        */
/* ------------------------------------------------------------------ */

export const ageGroupFacts = {
  heading: 'Under 10 Age Group, at a Glance',
  facts: [
    {
      label: 'Age definition',
      value:
        'Nine years of age as at midnight, 31 December, in the year the season ' +
        'starts (per LAA Standard Rules of Competition).'
    },
    {
      label: 'Footwear',
      value: 'No spike shoes permitted for the U9–10 age group, in any event.'
    },
    {
      label: 'High Jump technique',
      value:
        'Scissor technique only — the flop is not a legal technique until U11.',
      // Optional rule↔video linkage (AC53/AC54): only added where a video
      // genuinely clarifies the rule, driving the Rules tab's data-driven
      // rule-videos section rather than a hard-coded list there.
      resource: 'video-high-jump'
    },
    {
      label: 'Long Jump take-off',
      value:
        'A sand/soft-earth mat, not a board — placed within 0.5m of the landing pit.',
      resource: 'video-long-jump'
    },
    {
      label: 'Throwing implements',
      value: 'Shot Put 2kg (orange), Discus 500g. Javelin is not offered until U11.'
      // Deliberately NO resource: the videos show technique, not the
      // implement masses this rule specifies (AC54).
    },
    {
      label: 'Starting blocks',
      value: 'Not permitted until U11 — all races start from a standing start.',
      resource: 'video-standing-start'
    }
  ],
  source:
    'Source: Standard Rules for Competition of Little Athletics Australia Limited. ' +
    'Rules are reviewed periodically — always check the current edition and your own ' +
    'centre’s program, since some events (e.g. 60m Hurdles) are offered at the ' +
    'discretion of individual NSW centres.'
};

/* ------------------------------------------------------------------ */
/* Under 10 Boys — Events at a Glance (PDF page 4)                     */
/* ------------------------------------------------------------------ */

export const eventsAtAGlance = {
  heading: 'Under 10 Boys — Events at a Glance',
  columns: ['Event', 'Distance / Implement', 'Key U10 Rule'],
  /*
   * Row order follows the PDF and matches the 10 events in `events` below —
   * but the row labels ('Sprints', 'Hurdles*', '4 x 100m Relay',
   * 'Turbo Javelin*') do NOT match the corresponding event `name` strings
   * ('Standing Start & Sprints', 'Hurdles', '4 x 100m Relay & Baton Change',
   * 'Bonus: Turbo Javelin (Lead-Up Skill)'). Tonight-mode filtering needs a
   * reliable join, so each row carries an explicit `slug` rather than relying
   * on name-matching, which would silently mis-filter. `cells` is the exact
   * array previously passed straight to responsiveTable() — unchanged.
   */
  rows: [
    { slug: 'sprints', cells: ['Sprints', '70m · 100m · 200m', 'Standing start, run in lanes'] },
    { slug: 'middle-distance', cells: ['Middle Distance', '400m · 800m', 'Standing/group start'] },
    { slug: 'hurdles', cells: ['Hurdles*', '60m · 45cm height', '6 flights, collapsible hurdles'] },
    { slug: 'relay', cells: ['4 x 100m Relay', 'Team event', '30m take-over zone'] },
    {
      slug: 'race-walk',
      cells: ['Race Walk', '700m', 'Straight leg, continuous contact'],
      // Rule↔video linkage (AC53/AC54) — same mechanism as ageGroupFacts.facts
      // above, but this one is filtered by Tonight-mode selection along with
      // the rest of this table's rows (AC56), unlike the always-shown facts.
      resource: 'video-racewalking'
    },
    { slug: 'long-jump', cells: ['Long Jump', 'Mat take-off', 'Mat placed max 0.5m from pit'] },
    { slug: 'high-jump', cells: ['High Jump', 'Scissor technique only', 'Mat 150–300mm high'] },
    { slug: 'shot-put', cells: ['Shot Put', '2kg (orange)', 'Standing put from the circle'] },
    { slug: 'discus', cells: ['Discus', '500g', 'Standing throw from the circle'] },
    {
      slug: 'turbo-javelin',
      cells: [
        'Turbo Javelin*',
        'Skill only — not a competition event',
        'Lead-up to U11 Javelin'
      ]
    }
  ],
  footnote:
    '* Offered at many, but not all, NSW centres — check your own centre’s program.'
};

/* ------------------------------------------------------------------ */
/* The 10 events (PDF pages 5–18)                                      */
/* ------------------------------------------------------------------ */

export const events = [
  {
    slug: 'sprints',
    name: 'Standing Start & Sprints',
    tagline: '70m · 100m · 200m',
    quickFacts: [
      { label: 'Distances offered', value: '70m, 100m, 200m (all run in lanes)' },
      {
        label: 'Start',
        value: 'Standing start only – starting blocks not permitted until U11'
      },
      { label: 'Footwear', value: 'No spike shoes for U9–10 age group' },
      {
        label: 'Why it matters',
        value:
          'Sprinting is the base skill for almost every other event – relays, jumps ' +
          'and hurdles all begin with an efficient start and drive phase.'
      }
    ],
    beginner: [
      'Teach the standing start position: front foot on the line, back foot behind, weight forward over the front foot, opposite arm to front leg cocked back.',
      'Practise the three commands – “On your marks” (walk to the line), “Set” (still, weight forward), and the gun/whistle (drive away low).',
      'Drill the first five steps out of the start as short, powerful, low steps – “push the ground away, don’t reach for it”.',
      'Introduce tall running posture over the remaining distance: eyes forward, relaxed shoulders, hands moving pocket-to-cheek.'
    ],
    intermediate: [
      'Add reaction practice – vary the pause between “Set” and the signal so athletes learn to wait for it, not anticipate it.',
      'Work on the transition from the low drive phase into upright sprinting, over roughly 15–20m.',
      'Introduce simple relaxation cues for the middle of the race – “loose jaw, loose hands” – to stop athletes tightening up and slowing down.',
      'Practise a strong finish: run through the line rather than leaning, dipping or looking sideways at competitors.'
    ],
    faults: [
      'Standing up out of the drive phase too early – keep the shin angle low for the first steps.',
      'False-starting by anticipating the signal – fix with more “Set-and-hold” reps.',
      'Looking at other runners mid-race, which twists the body and costs speed.'
    ],
    safety:
      'Always start sprints with athletes facing away from other events in progress, ' +
      'and keep the finish chute clear of officials and younger siblings.',
    resources: ['video-standing-start', 'video-running-technique']
  },

  {
    slug: 'middle-distance',
    name: 'Middle Distance Running',
    tagline: '400m · 800m',
    quickFacts: [
      {
        label: 'Distances offered',
        value: '400m (in lanes), 800m (lanes for first bend, then break)'
      },
      {
        label: 'Key skill',
        value: 'Even pacing – most U10 boys go off too fast and fade'
      },
      { label: 'Start', value: 'Standing start, group start for the 800m' }
    ],
    beginner: [
      'Use the same standing start and tall running posture taught for sprints – the technique doesn’t change, only the effort level does.',
      'Teach the idea of “cruise pace” versus “sprint pace” using simple language: “run like you could hold a conversation for the first half”.',
      'Practise breathing rhythm – in for two steps, out for two steps – to stop early panic breathing.',
      'Walk the 800m break-line rule so athletes know exactly where they can move off their lane.'
    ],
    intermediate: [
      'Introduce simple even-split practice: time the first and second half of a 400m and aim to keep them close together.',
      'Teach a controlled last-100m kick, saved for the final stretch rather than used early.',
      'Practise running comfortably in a pack for the 800m without being boxed in on the rail.'
    ],
    faults: [
      'Sprinting the first 100m of an 800m and running out of energy – fix with pace-judgement games (see Games section).',
      'Holding the breath or breathing erratically under fatigue.',
      'Drifting wide on bends, which adds distance – cue “hug the inside line” where lanes allow.'
    ],
    safety:
      'In the 800m, brief athletes clearly on where the break-line is before the race ' +
      'so the move from lanes to single file happens safely.',
    resources: ['video-running-technique'],
    /*
     * Per-resource note override, keyed by resource key. The guide gives this
     * shared video a different framing on the Middle Distance page than on the
     * Sprints page. Keyed (not a bare string) so an event with several
     * resources can override exactly one of them.
     */
    resourceNotes: {
      'video-running-technique':
        'The same running-technique fundamentals apply at middle-distance pace – ' +
        'use this as your technical reference.'
    }
  },

  {
    slug: 'hurdles',
    name: 'Hurdles',
    tagline: '60m hurdles · 45cm',
    quickFacts: [
      { label: 'Height', value: '45cm hurdles (collapsible type) for U9–10' },
      {
        label: 'Layout',
        value: '6 flights over 60m – 12m run-in, 7m between flights, 13m run-out'
      },
      {
        label: 'Offered',
        value:
          'Many, but not all, NSW centres run this at U10 – check your centre’s program'
      }
    ],
    beginner: [
      'Start with hurdle mobility, not hurdling: walk over hurdles lying flat, then on their side, before raising them.',
      'Teach the lead-leg action as a “step over a puddle” – knee drives up and through, not a jump.',
      'Teach the trail leg to fold tight and sweep through low and fast, heel close to the bottom.',
      'Keep the very first hurdles low and close together so athletes get rhythm before speed.'
    ],
    intermediate: [
      'Introduce a consistent stride pattern between hurdles (most U10s will settle on an odd number of strides, commonly 5).',
      'Work on “attacking” the hurdle with the chest, rather than sitting back and floating over it.',
      'Add a controlled approach run so athletes arrive at the first hurdle on the correct stride, not chopping their steps.'
    ],
    faults: [
      'Jumping the hurdle with two feet together, like a show-jumping horse – always one leg leads.',
      'Ducking the head and shoulders down, which slows the whole action.',
      'Braking before the hurdle instead of running through it.'
    ],
    safety:
      'Hurdles must only ever be cleared from the correct direction – clearing them ' +
      'backwards stops them from collapsing safely and can cause injury.',
    resources: ['video-hurdles']
  },

  {
    slug: 'relay',
    name: '4 x 100m Relay & Baton Change',
    tagline: 'Team event',
    quickFacts: [
      { label: 'Change zone', value: '30m take-over zone, scratch line 20m in' },
      {
        label: 'Baton rule',
        value: 'Must be carried by hand and passed within the zone'
      },
      {
        label: 'Key skill',
        value:
          'A clean, fast hand-to-hand exchange matters more than any one runner’s top speed'
      }
    ],
    beginner: [
      'Start stationary: pairs stand still, practise the verbal cue (“Hand!”) and the hand-to-hand exchange without any running.',
      'Teach one simple pass method consistently – the push pass (receiver’s palm up and steady, incoming runner places the baton firmly into it) is easiest for beginners.',
      'Add walking, then jogging exchanges before ever running at speed.',
      'Teach the receiver to hold their hand steady and let the incoming runner do the work – don’t snatch at the baton.'
    ],
    intermediate: [
      'Introduce the take-over zone and a simple “go-mark” – a spot the receiver starts moving from when the incoming runner reaches it.',
      'Practise exchanges at increasing speed, always prioritising a clean pass over an early, risky one.',
      'Rehearse full team changeovers in the actual lanes you’ll race in, so athletes are comfortable with the layout on competition day.'
    ],
    faults: [
      'Receiver looking back for the baton (for the 4x100m) instead of trusting the verbal cue and reaching back – build this up gradually, it’s a confidence skill.',
      'Receiver starting too early or too late relative to the incoming runner – fix with go-mark practice.',
      'Baton passed outside the take-over zone – always rehearse the zone markings before race day.'
    ],
    safety:
      'Keep spare batons and a clear marshalling system so teams aren’t rushed into ' +
      'the zone – most drops happen when kids feel hurried.',
    resources: ['article-relay-changes']
  },

  {
    slug: 'race-walk',
    name: 'Race Walk',
    tagline: '700m',
    quickFacts: [
      { label: 'Distance', value: '700m for U9–10' },
      {
        label: 'Legal technique',
        value:
          'Straight leading leg at contact; some part of the foot must appear to stay ' +
          'in contact with the ground at all times'
      }
    ],
    beginner: [
      'Teach the straight-leg contact rule first, slowly, before worrying about speed at all: “knee locks straight the moment your foot lands”.',
      'Practise a visible hip rotation/roll – it’s what generates speed without breaking contact or bending the knee.',
      'Keep arms bent at roughly 90 degrees, driving front-to-back close to the body.',
      'Start every session with slow-motion walking to groove the technique before adding pace.'
    ],
    intermediate: [
      'Gradually build cadence (steps per minute) while keeping technique legal – speed should come from quicker, not longer, steps.',
      'Add short pace changes so athletes learn to speed up without lifting off the ground (a common disqualification risk).',
      'Practise racing in a small group so athletes get used to walking near others without breaking technique.'
    ],
    faults: [
      '“Creeping” – a visible loss of contact with the ground, which is effectively running.',
      'Bent knee at contact, which is the most common reason for a caution.',
      'Excessive up-and-down body movement instead of the hip roll – wastes energy.'
    ],
    safety:
      'Race walking is a genuine technical event – avoid letting it turn into a ' +
      'race-to-run; slow it right down and prioritise legal technique over speed.',
    resources: ['video-racewalking']
  },

  {
    slug: 'long-jump',
    name: 'Long Jump',
    tagline: 'Mat take-off',
    quickFacts: [
      {
        label: 'Take-off',
        value:
          '0.5m x 1.22m mat covered in damp sand/soft earth, placed max 0.5m from the pit'
      },
      {
        label: 'Measurement',
        value: 'From the take-off imprint to the nearest break in the sand'
      },
      { label: 'Footwear', value: 'No spikes for U9–10' }
    ],
    beginner: [
      'Start with a standing long jump – two feet to two feet – to build the arm swing and landing habit (“land like a frog”, knees bent, arms forward).',
      'Progress to a one-foot take-off, two-foot landing, from a walk-in approach of just a few steps.',
      'Find each athlete’s natural take-off foot before formalising a run-up – most kids will show a clear preference.',
      'Keep the very first run-ups short (4–6 strides) – accuracy matters far more than speed at this stage.'
    ],
    intermediate: [
      'Measure and mark a consistent run-up starting point, matching stride count roughly to age (a longer run-up isn’t automatically better for U10s).',
      'Teach the last two strides as “down-up” – a slightly lower second-last step, then drive up and out at take-off.',
      'Add knee-and-arm drive at take-off to hang in the air longer, then reach the legs forward to land.'
    ],
    faults: [
      'Taking off from two feet, which is not a legal jump – revisit the standing jump progression if this happens often.',
      'Looking down at the mat while running in, which shortens and slows the last strides.',
      'Sitting back on landing instead of reaching the feet forward – costs measured distance.'
    ],
    safety:
      'Rake the sand pit level and check for hidden edges or debris before each ' +
      'session; make sure no athlete starts their run-up until the pit is clear.',
    resources: ['video-long-jump', 'article-long-jump-run-up']
  },

  {
    slug: 'high-jump',
    name: 'High Jump (Scissor Technique)',
    tagline: 'Scissor technique only',
    quickFacts: [
      {
        label: 'Rule',
        value:
          'Scissor technique is the ONLY legal technique for U8, U9 and U10 – the flop ' +
          'is not permitted'
      },
      { label: 'Mat height', value: 'Scissor mats 150–300mm high, minimum 5m x 3m' },
      {
        label: 'Legal jump',
        value:
          'Lead foot must touch the mat before any other body part; head must not clear ' +
          'the bar before the lead leg'
      }
    ],
    beginner: [
      'Start with no bar at all – athletes run in from an angle and simply step up onto the mat, getting used to the run-in angle and the mat.',
      'Add a soft, flexible bar (foam/elastic) before ever using a real crossbar, so early misses aren’t discouraging.',
      'Teach the approach as a straight line at roughly 30–40 degrees to the bar – not side-on, not head-on.',
      'Teach the outside leg as the take-off leg, kicking the inside leg up and over first.'
    ],
    intermediate: [
      'Introduce a real crossbar at a low, achievable height once the run-in and leg action are consistent.',
      'Work on a straight lead-leg kick (not a bent-knee drive) so the leg fully clears the bar.',
      'Teach athletes to finish “seated” or standing on the far mat, landing on their feet or seat, never on their back or head.'
    ],
    faults: [
      'Approaching the bar side-on or straight-on instead of at an angle – makes clearing the bar with a scissor action very difficult.',
      'Head crossing the bar before the lead leg – an illegal jump under the scissor rule.',
      'Landing on the back or head – stop and reset technique immediately if this happens, it’s a safety issue, not just a rules one.'
    ],
    safety:
      'Never allow flop-style backward landings at this age – the scissor rule exists ' +
      'specifically because U9–10 landing mats are shallower than senior flop beds.',
    resources: ['video-high-jump', 'article-scissors-high-jump']
  },

  {
    slug: 'shot-put',
    name: 'Shot Put',
    tagline: '2kg (orange)',
    quickFacts: [
      { label: 'Implement', value: '2kg shot (orange) for U9–10' },
      {
        label: 'Technique',
        value:
          'Standing put from inside the circle – no glide or rotation needed at this age'
      },
      {
        label: 'Grip',
        value:
          'Shot rests on the base of the fingers, not the palm, tucked under the jaw ' +
          'against the neck'
      }
    ],
    beginner: [
      'Teach the grip and hold first, without throwing: “elbows up, thumbs down, palms out”, shot resting against the neck under the jaw.',
      'Start front-on to the target with feet parallel, and practise a simple one-arm “put” – pushing, not throwing, the shot away from the neck.',
      'Rehearse the action often without the shot itself, especially with younger or first-time athletes.',
      'Reinforce the “put” motion, not a baseball-style throw – the shot should be pushed off the neck in one straight line.'
    ],
    intermediate: [
      'Introduce a slightly open (side-on) stance to allow a small hip and shoulder turn into the put.',
      'Add a rock back onto the rear foot and drive forward through the legs before the arm finishes the put.',
      'Teach a full extension finish, “thumb down”, with the throwing arm following through toward the target.'
    ],
    faults: [
      'Holding the shot in the palm rather than the fingers – makes control difficult and can strain the wrist.',
      'Throwing the shot like a ball instead of putting it – fix by returning to close-range pushes.',
      'Stepping out of the front of the circle before the put is measured – always wait for the judge’s signal.'
    ],
    safety:
      'Never allow athletes to walk in front of, or collect implements from, the ' +
      'throwing sector until a judge signals it is safe to do so.',
    resources: ['video-shot-put', 'article-shot-put']
  },

  {
    slug: 'discus',
    name: 'Discus',
    tagline: '500g',
    quickFacts: [
      { label: 'Implement', value: '500g discus for U9–10' },
      {
        label: 'Technique',
        value:
          'Standing throw from inside the circle – no spin/rotation needed at this age'
      },
      {
        label: 'Grip',
        value:
          'Discus rests flat along the finger pads, thumb resting lightly on top – not ' +
          'gripped tightly'
      }
    ],
    beginner: [
      'Teach the grip with a simple image: fingers are “shy little people” peeking over the edge of the discus, spread evenly around the rim.',
      'Teach the “discus sandwich” starting position – both hands together holding the discus, side-on to the target.',
      'Practise a standing throw with a simple weight shift: rock back onto the rear foot as the arm swings back, then rock forward and “unmake the sandwich” to release.',
      'Rehearse the swing-and-release action often without letting go, to build confidence in the motion.'
    ],
    intermediate: [
      'Add a small hip and shoulder turn into the release, keeping the arm long and relaxed rather than tense.',
      'Work on releasing the discus off the index finger with a flat, spinning action rather than a wobble.',
      'Introduce a controlled follow-through and reminder to stay inside the circle until the throw is measured.'
    ],
    faults: [
      'Gripping the discus too tightly in the palm – it should rest on the finger pads and spin freely off the index finger.',
      'Releasing off-balance or falling out of the front of the circle before the throw lands.',
      '“Throwing” with a bent, whipping arm instead of a longer, more relaxed swing.'
    ],
    safety:
      'Always throw inside a cage or with a clear, marshalled landing sector; keep ' +
      'waiting athletes behind a marked line, well clear of the circle and cage netting.',
    resources: ['video-discus', 'article-discus']
  },

  {
    slug: 'turbo-javelin',
    name: 'Bonus: Turbo Javelin (Lead-Up Skill)',
    tagline: 'Not a competition event until U11',
    quickFacts: [
      {
        label: 'Status',
        value:
          'Javelin is not a standard NSW/LAA event until U11 – treat this purely as a ' +
          'fun, low-stakes lead-up skill'
      },
      {
        label: 'Implement',
        value:
          'A soft turbo jav / vortex-style implement, never a real javelin, is ' +
          'appropriate at this age'
      }
    ],
    beginner: [
      'Use an overarm throwing action identical to a good cricket or tennis throw – side-on, non-throwing arm pointing at the target.',
      'Keep throws short and safe, in a wide, clearly marshalled fan-shaped area with a single thrower at a time.',
      'Focus purely on a safe, confident overarm release – there is no benefit in teaching a formal run-up at this age.'
    ],
    intermediate: [
      'Add a few walking steps into the throw once the overarm action is safe and consistent.',
      'Introduce simple distance and accuracy games (see the Games section) to keep this light and enjoyable.'
    ],
    faults: [
      'Throwing side-arm (like a discus) instead of overarm – the most common and important thing to correct early.',
      'Groups standing in the landing sector – always throw in one direction only, into open space.'
    ],
    safety:
      'Because this isn’t a competition event for this age group, keep sessions ' +
      'playful and low-pressure – the goal is safe habits for later, not performance now.',
    resources: ['video-javelin']
  }
];

/* ------------------------------------------------------------------ */
/* Event categories — drives the Events tab's grouped-by-discipline    */
/* list (js/views/events.js). Fixed grouping, in this order, per an    */
/* explicit product decision from the approved Events-tab redesign.    */
/* Slugs are validated against `events` by assertContentLinkage()      */
/* below, same treatment as eventsAtAGlance.rows and games' eventSlugs */
/* — a typo here must fail loudly at load, not silently drop an event  */
/* from every category (which would silently drop it from the Events   */
/* list entirely, since events.js renders only what a category claims).*/
/* ------------------------------------------------------------------ */

export const eventCategories = [
  { id: 'track', name: 'Track', slugs: ['sprints', 'middle-distance', 'hurdles', 'relay', 'race-walk'] },
  { id: 'jumps', name: 'Jumps', slugs: ['long-jump', 'high-jump'] },
  { id: 'throws', name: 'Throws', slugs: ['shot-put', 'discus'] },
  { id: 'bonus', name: 'Bonus', slugs: ['turbo-javelin'] }
];

/* ------------------------------------------------------------------ */
/* Weekly event program — Canterbury Athletics Club                    */
/*                                                                     */
/* The club publishes six rotating programs (A–F) as "Order of Events  */
/* By Age" grids: 15-minute time slots down the side, age groups       */
/* across the top, an abbreviated event code in each cell. That grid   */
/* already answers the question the Tonight picker used to ask the     */
/* coach to answer by hand ("which events are on tonight?"), and it    */
/* answers two the picker never could — at what time, and at which     */
/* field position.                                                     */
/*                                                                     */
/* PROVENANCE. All six grids (A–F) are transcribed cell-by-cell from    */
/* the images published at the `source.url` page. Program A came from  */
/* that page directly; B–F were supplied by the club as images,        */
/* because on the live page their <img src> values point at            */
/* http://centrewebsiteadmin.resultshq.com.au/... instead of the       */
/* https://clac.org.au/... copies, so a browser blocks them and only   */
/* Program A renders. Re-check against the club's page each season.    */
/*                                                                     */
/* A program whose grid is NOT available is declared `slots: null`.    */
/* getRunningOrder() reports that as its own state rather than         */
/* silently rendering an empty night. None are null today; the path is */
/* kept for the next program the club adds before publishing it.       */
/*                                                                     */
/* SHAPE. `slots[ageId]` is an array of `[time, code]` (or             */
/* `[time, code, 'pack-up']` where the published grid shades that cell */
/* to mean "pack up field equipment"). `time` must appear in           */
/* `slotOrder`; `code` must be a key of `codes`.                       */
/*                                                                     */
/* `codes` maps a published abbreviation to THIS guide's own event via */
/* `slug`, so an event's name, tagline and key rule are never          */
/* A handful of cells name TWO events ("100m / SP1, SP2"). Those carry */
/* an `also` array: the card links to `slug`, and `also` keeps the     */
/* other event in tonight's selection so the Games and Rules tabs      */
/* don't quietly drop it.                                              */
/* duplicated here — they stay in `events` / `eventsAtAGlance` and are */
/* resolved at read time. `slug: null` means the club runs that event  */
/* for that age but this U10 guide has no page for it (Triple Jump,    */
/* Javelin); those carry their own `name` and render as a flagged      */
/* row rather than being dropped, so a coach reading another age       */
/* group's night doesn't see a silently short program.                 */
/* ------------------------------------------------------------------ */

export const weeklyProgram = {
  source: {
    name: 'Canterbury Athletics Club weekly event program',
    url: 'https://clac.org.au/weekly-event-program/',
    note:
      'Minor changes to the program happen week to week and all timings are ' +
      'approximate. Check your age group chat for the latest.'
  },

  /* Every 15-minute slot the published grids use, in order. The trailing
     8.45 is not a slot any age is scheduled into — it exists so a block
     that ENDS at 8.30 can name the time it runs until. */
  slotOrder: [
    '6.00', '6.15', '6.30', '6.45', '7.00', '7.15', '7.30', '7.45',
    '8.00', '8.15', '8.30', '8.45', '9.00', '9.15'
  ],

  /* Column headings of the published grid, in its own left-to-right order.
     Two columns cover more than one age ('14, 15' and '16-20'), so an id is
     not always a single number — never parse these as integers. */
  ageGroups: [
    { id: '6', name: 'Under 6' },
    { id: '7', name: 'Under 7' },
    { id: '8', name: 'Under 8' },
    { id: '9', name: 'Under 9' },
    { id: '10', name: 'Under 10' },
    { id: '11', name: 'Under 11' },
    { id: '12', name: 'Under 12' },
    { id: '13', name: 'Under 13' },
    { id: '14-15', name: 'Under 14, 15' },
    { id: '16-20', name: 'Under 16-20' }
  ],

  /* This guide is the Under 10 Boys manual, so U10 is what the picker
     opens on. Must be one of `ageGroups`' ids (asserted below). */
  defaultAgeId: '10',

  programs: [
    {
      id: 'A',
      name: 'Program A',
      slots: {
        '6': [['6.00', 'D1, D1A'], ['6.15', 'D1, D1A'], ['6.30', '50m'], ['6.45', '200m*']],
        '7': [['6.00', '50m'], ['6.15', '200m'], ['6.30', 'SP3, SP3A'], ['6.45', 'SP3, SP3A', 'pack-up']],
        '8': [['6.00', '200m'], ['6.15', '100m'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3']],
        '9': [['6.00', 'LJ2, LJ3'], ['6.15', 'LJ2, LJ3'], ['6.30', '800m'], ['6.45', '70m'], ['7.00', 'SP1, SP2'], ['7.15', 'SP1, SP2', 'pack-up']],
        '10': [['6.00', 'D2 (G), D3 (B)'], ['6.15', 'D2 (G), D3 (B)'], ['6.30', 'HJ3, HJ4 (Sc)'], ['6.45', 'HJ3, HJ4 (Sc)'], ['7.00', '70m'], ['7.15', 'HJ3, HJ4 (Sc)'], ['7.30', '800m'], ['7.45', 'HJ3, HJ4 (Sc)', 'pack-up']],
        '11': [['6.00', '1500m'], ['6.15', 'HJ1 (practice only)'], ['6.30', 'SP1, SP2'], ['6.45', 'SP1, SP2'], ['7.00', 'LJ2, LJ3'], ['7.15', 'LJ2, LJ3'], ['7.30', 'LJ2, LJ3'], ['7.45', '100m']],
        '12': [['6.00', 'TJ1'], ['6.15', 'TJ1'], ['6.30', 'TJ1'], ['6.45', 'TJ1 or HJ1 (practice only)'], ['7.00', 'D2 (G), D3 (B)'], ['7.15', 'D2 (G), D3 (B)', 'pack-up'], ['7.30', '100m'], ['7.45', '1500m']],
        '13': [['6.00', 'SP1, SP2'], ['6.15', 'SP1, SP2'], ['6.30', 'HJ1 (practice only)'], ['6.45', '200mH'], ['7.00', 'LJ1'], ['7.15', '1500m'], ['7.30', 'LJ1'], ['7.45', 'LJ1', 'pack-up'], ['8.00', '100m']],
        '14-15': [['6.00', 'HJ1 (practice only)'], ['6.15', '1500m'], ['6.30', 'D2 (G), D3 (B)'], ['6.45', 'D2 (G), D3 (B)'], ['7.00', '300mH'], ['7.15', '300mH'], ['7.30', 'Relay practice', 'pack-up'], ['7.45', 'TJ2, TJ3'], ['8.00', 'TJ2, TJ3', 'pack-up'], ['8.15', '100m']],
        '16-20': [['6.00', 'HJ2'], ['6.15', 'HJ2'], ['6.30', 'HJ2'], ['6.45', 'HJ2'], ['7.00', '1500m'], ['7.15', '100m'], ['7.30', '400mH (G)'], ['7.45', '400mH (B)'], ['8.00', '400mH (B)'], ['8.15', 'Jav 1 (Nth)'], ['8.30', 'Jav 1 (Nth)', 'pack-up']]
      }
    },
    {
      id: 'B',
      name: 'Program B',
      slots: {
        '6': [['6.00', 'LJ2, LJ3'], ['6.15', 'LJ2, LJ3'], ['6.30', 'Vortex'], ['6.45', '70m'], ['7.00', '300m*']],
        '7': [['6.00', 'D1, D1A'], ['6.15', 'D1, D1A'], ['6.30', '70m'], ['6.45', '500m']],
        '8': [['6.00', '70m'], ['6.15', 'SP3'], ['6.30', 'SP3'], ['6.45', 'SP3', 'pack-up'], ['7.00', 'Tug of war'], ['7.15', '700m']],
        '9': [['6.00', 'D2 (G), D3 (B)'], ['6.15', 'D2 (G), D3 (B)'], ['6.30', '200m'], ['6.45', 'HJ (Sc)'], ['7.00', '100m'], ['7.15', 'HJ (Sc)'], ['7.30', 'HJ (Sc)'], ['7.45', 'HJ (Sc)', 'pack-up']],
        '10': [['6.00', 'SP1, SP2'], ['6.15', '100m / SP1, SP2'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3'], ['7.00', '200m']],
        '11': [['6.00', 'HJ1'], ['6.15', 'HJ1'], ['6.30', 'HJ1'], ['6.45', '200m'], ['7.00', 'Vortex', 'pack-up'], ['7.15', 'Jav 2'], ['7.30', '800m'], ['7.45', 'Jav 2'], ['8.00', 'Jav 2', 'pack-up']],
        '12': [['6.00', 'LJ1'], ['6.15', 'LJ1'], ['6.30', 'LJ1'], ['6.45', 'LJ1'], ['7.00', 'SP1, SP2'], ['7.15', 'SP1, SP2'], ['7.30', '200m'], ['7.45', '800m']],
        '13': [['6.00', 'HJ2'], ['6.15', 'HJ2'], ['6.30', '800m'], ['6.45', 'HJ2'], ['7.00', 'Relay practice'], ['7.15', '200m'], ['7.30', 'Jav 1 (Nth)'], ['7.45', 'Jav 1 (Nth)'], ['8.00', '3000m']],
        '14-15': [['6.00', '200m'], ['6.15', '800m'], ['6.30', 'SP1, SP2'], ['6.45', 'SP1, SP2'], ['7.00', 'LJ2, LJ3'], ['7.15', 'LJ2, LJ3'], ['8.00', '3000m']],
        '16-20': [['6.00', '800m'], ['6.15', '200m'], ['6.30', 'D2'], ['6.45', 'D2'], ['7.00', 'D2'], ['7.15', 'TJ1'], ['7.30', 'TJ1'], ['7.45', 'TJ1', 'pack-up'], ['8.00', '3000m']]
      }
    },
    {
      id: 'C',
      name: 'Program C',
      slots: {
        '6': [['6.00', 'SP3, SP3A'], ['6.15', 'SP3, SP3A', 'pack-up'], ['6.30', '70m'], ['6.45', '100m']],
        '7': [['6.00', '70m'], ['6.15', '100m'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3'], ['7.00', 'LJ2, LJ3']],
        '8': [['6.00', '400m*'], ['6.15', 'D1, D1A'], ['6.30', 'D1, D1A'], ['6.45', 'D1, D1A'], ['7.00', 'Vortex'], ['7.15', '60m H (45cm)']],
        '9': [['6.00', 'SP1, SP2'], ['6.15', 'SP1, SP2'], ['6.30', 'HJ practice'], ['6.45', '400m'], ['7.00', '700m W'], ['7.15', 'LJ2, LJ3'], ['7.30', '60m H (45cm)'], ['7.45', 'LJ2, LJ3'], ['8.00', 'LJ2, LJ3', 'pack-up']],
        '10': [['6.00', 'D2 (G), D3 (B)'], ['6.15', 'D2 (G), D3 (B)'], ['6.30', '1100m W'], ['6.45', 'HJ (Sc)'], ['7.00', 'HJ (Sc)'], ['7.15', '400m'], ['7.30', 'HJ (Sc)'], ['7.45', '60m H (60cm)'], ['8.00', 'HJ (Sc)', 'pack-up']],
        '11': [['6.00', '400m'], ['6.15', '1100m W'], ['6.30', 'D2 (B), D3 (G)'], ['6.45', 'D2 (B), D3 (G)'], ['7.00', 'TJ1'], ['7.15', 'TJ1'], ['7.30', 'TJ1'], ['7.45', 'TJ1', 'pack-up'], ['8.00', '80m H (60cm)']],
        '12': [['6.00', 'Vortex'], ['6.15', '400m'], ['6.30', 'Tug of war'], ['6.45', '1500m W'], ['7.00', 'HJ1, HJ2'], ['7.15', 'HJ1, HJ2'], ['7.30', 'HJ1, HJ2'], ['7.45', 'Jav 2 (Sth)'], ['8.00', 'Jav 2 (Sth)'], ['8.15', '80m H (68cm)']],
        '13': [['6.00', 'TJ2, TJ3'], ['6.15', 'TJ2, TJ3'], ['6.30', '400m'], ['6.45', '1500m W'], ['7.00', 'D1, D2'], ['7.15', 'D1, D2', 'pack-up'], ['7.30', 'Vortex', 'pack-up'], ['7.45', 'Tug of war'], ['8.00', 'HJ practice'], ['8.15', 'HJ practice'], ['8.30', '80m H (G) (76cm)'], ['8.45', '90m H (B) (76cm)']],
        '14-15': [['6.00', 'HJ1, HJ2'], ['6.15', 'HJ1, HJ2'], ['6.30', 'HJ1, HJ2'], ['6.45', 'HJ1, HJ2'], ['7.00', 'Tug of war'], ['7.15', '1500m W'], ['7.30', '400m'], ['7.45', 'Tug of war'], ['8.00', 'Jav 1 (Nth)'], ['8.15', 'Jav 1 (Nth)'], ['8.30', 'Jav 1 (Nth)', 'pack-up'], ['8.45', '90m H (G) (76cm)'], ['9.00', '100m H (B) (76cm)']],
        '16-20': [['6.00', 'LJ1'], ['6.15', 'LJ1'], ['6.30', 'LJ1'], ['6.45', 'LJ1'], ['7.00', '400m'], ['7.15', '1500m W'], ['7.30', 'SP1, SP2'], ['7.45', 'SP1, SP2', 'pack-up'], ['8.00', 'Tug of war', 'pack-up'], ['8.15', 'HJ practice'], ['8.30', 'HJ practice'], ['8.45', 'HJ practice', 'pack-up'], ['9.00', '100m H (76cm)']]
      }
    },
    {
      id: 'D',
      name: 'Program D',
      slots: {
        '6': [['6.00', '50m'], ['6.15', '200m*'], ['6.30', 'D1, D1A'], ['6.45', 'D1, D1A', 'pack-up']],
        '7': [['6.00', '200m'], ['6.15', '50m'], ['6.30', 'SP3, SP3A'], ['6.45', 'SP3, SP3A']],
        '8': [['6.00', 'HJ practice'], ['6.15', '200m'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3'], ['7.00', '100m']],
        '9': [['6.00', 'D1A, D3'], ['6.15', 'D1A, D3'], ['6.30', 'HJ (Sc)'], ['6.45', 'HJ (Sc)'], ['7.00', '800m'], ['7.15', 'HJ (Sc)'], ['7.30', 'HJ (Sc)', 'pack-up'], ['7.45', '70m']],
        '10': [['6.00', 'SP1, SP2'], ['6.15', 'SP1, SP2'], ['6.30', '800m'], ['6.45', '70m'], ['7.00', 'LJ2, LJ3'], ['7.15', 'LJ2, LJ3']],
        '11': [['6.00', 'LJ2, LJ3'], ['6.15', 'LJ2, LJ3'], ['6.30', 'SP1, SP2'], ['6.45', 'SP1, SP2'], ['7.00', 'Tug of war'], ['7.15', '100m'], ['7.30', '1500m']],
        '12': [['6.00', '1500m'], ['6.15', 'HJ practice'], ['6.30', 'D2'], ['6.45', 'D2'], ['7.00', 'TJ1'], ['7.15', 'TJ1'], ['7.30', 'TJ1'], ['7.45', 'TJ1', 'pack-up'], ['8.00', '100m']],
        '13': [['6.00', 'LJ1'], ['6.15', 'LJ1'], ['6.30', 'LJ1'], ['6.45', '200mH'], ['7.00', 'SP1, SP2', 'pack-up'], ['7.15', 'Tug of war'], ['7.30', '100m'], ['7.45', '1500m']],
        '14-15': [['6.00', 'D1, D2'], ['6.15', 'D1, D2'], ['6.30', '100m'], ['6.45', 'HJ practice'], ['7.00', '300mH'], ['7.15', '1500m'], ['7.30', 'TJ2, TJ3'], ['7.45', 'TJ2, TJ3', 'pack-up']],
        '16-20': [['6.00', 'HJ1'], ['6.15', 'HJ1'], ['6.30', 'HJ1'], ['6.45', '1500m'], ['7.00', 'HJ1', 'pack-up'], ['7.15', '400mH'], ['7.30', 'Jav 1 (Nth) / 400m H'], ['7.45', 'Jav 1 (Nth) / 400m H'], ['8.00', 'Jav 1 (Nth)', 'pack-up'], ['8.15', '100m']]
      }
    },
    {
      id: 'E',
      name: 'Program E',
      slots: {
        '6': [['6.00', '70m'], ['6.15', '300m*'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3']],
        '7': [['6.00', 'HJ practice'], ['6.15', '70m'], ['6.30', 'D1A'], ['6.45', 'D1A', 'pack-up'], ['7.00', '500m*']],
        '8': [['6.00', 'SP3'], ['6.15', 'SP3'], ['6.30', '700m'], ['6.45', '70m'], ['7.00', 'SP3', 'pack-up']],
        '9': [['6.00', 'SP1, SP2'], ['6.15', 'SP1, SP2', 'pack-up'], ['6.30', '100m'], ['6.45', 'Tug of war'], ['7.00', '200m'], ['7.15', 'LJ2, LJ3'], ['7.30', 'LJ2, LJ3'], ['7.45', 'LJ2, LJ3']],
        '10': [['6.00', 'D1 (G), D3 (B)'], ['6.15', 'D1 (G), D3 (B)'], ['6.30', 'D3'], ['6.45', 'HJ (Sc)'], ['7.00', '100m'], ['7.15', 'HJ (Sc)'], ['7.30', '200m'], ['7.45', 'HJ (Sc)'], ['8.00', 'HJ (Sc)', 'pack-up']],
        '11': [['6.00', '200m'], ['6.15', 'HJ2'], ['6.30', 'HJ2'], ['6.45', 'HJ2'], ['7.00', 'HJ2'], ['7.15', 'Tug of war', 'pack-up'], ['7.30', 'Jav 2'], ['7.45', '800m'], ['8.00', 'Jav 2'], ['8.15', 'Jav 2']],
        '12': [['6.00', 'LJ1'], ['6.15', 'LJ1'], ['6.30', 'LJ1'], ['6.45', 'SP1, SP2'], ['7.00', 'Tug of war'], ['7.15', '200m'], ['7.30', '800m']],
        '13': [['6.00', 'HJ1'], ['6.15', '200m'], ['6.30', 'HJ1'], ['6.45', 'HJ1'], ['7.00', 'Jav 1'], ['7.15', '800m'], ['7.30', 'Jav 1'], ['7.45', 'Jav 1', 'pack-up'], ['8.00', '3000m']],
        '14-15': [['6.00', 'LJ2, LJ3'], ['6.15', 'LJ2, LJ3'], ['6.30', '200m'], ['6.45', '800m'], ['7.00', 'SP1, SP2'], ['7.15', 'SP1, SP2', 'pack-up'], ['8.00', '3000m']],
        '16-20': [['6.00', '800m / D2'], ['6.15', 'D2'], ['6.30', 'D2', 'pack-up'], ['6.45', '200m'], ['7.00', 'TJ1'], ['7.15', 'TJ1'], ['8.00', '3000m']]
      }
    },
    {
      id: 'F',
      name: 'Program F',
      slots: {
        '6': [['6.00', 'SP3, SP3A'], ['6.15', 'SP3, SP3A', 'pack-up'], ['6.30', '70m'], ['6.45', '100m']],
        '7': [['6.00', '70m'], ['6.15', '100m'], ['6.30', 'LJ2, LJ3'], ['6.45', 'LJ2, LJ3'], ['7.00', 'LJ2, LJ3']],
        '8': [['6.00', 'D1, D1A'], ['6.15', 'D1, D1A'], ['6.30', '400m*'], ['6.45', 'HJ practice'], ['7.00', '60m H']],
        '9': [['6.00', 'D2 (G), D3 (B)'], ['6.15', 'D2 (G), D3 (B)'], ['6.30', '400m'], ['6.45', '700m W'], ['7.00', 'HJ3, HJ4 (Sc)'], ['7.15', '60m H'], ['7.30', 'HJ3, HJ4 (Sc)'], ['7.45', 'HJ3, HJ4 (Sc)']],
        '10': [['6.00', 'LJ2, LJ3'], ['6.15', 'LJ2, LJ3'], ['6.30', 'SP1, SP2'], ['6.45', 'SP1, SP2', 'pack-up'], ['7.00', '400m'], ['7.15', '1100m W'], ['7.30', '60m H']],
        '11': [['6.00', '400m'], ['6.15', '1100m W'], ['6.30', 'D1, D2'], ['6.45', 'D1, D2'], ['7.00', 'Tug of war'], ['7.15', 'TJ2, TJ3'], ['7.30', 'TJ2, TJ3', 'pack-up'], ['7.45', '80m H']],
        '12': [['6.00', 'HJ1'], ['6.15', 'HJ1'], ['6.30', 'HJ1'], ['6.45', '400m'], ['7.00', '1500m W'], ['7.15', 'Jav 1 (Nth)'], ['7.30', 'Jav 1 (Nth)'], ['7.45', 'Jav 1 (Nth)', 'pack-up'], ['8.00', '80m H']],
        '13': [['6.00', 'TJ1'], ['6.15', 'TJ1'], ['6.30', 'TJ1'], ['6.45', 'TJ1'], ['7.00', 'D1, D2'], ['7.15', 'D1, D2', 'pack-up'], ['7.30', '400m'], ['7.45', '1500m W'], ['8.00', 'Tug of war', 'pack-up'], ['8.15', '80m H (G) / 90m H (B)']],
        '14-15': [['6.00', '1500m W'], ['6.15', '400m'], ['6.30', 'HJ2'], ['6.45', 'HJ2'], ['7.00', 'HJ2'], ['7.15', 'HJ2'], ['7.30', 'Jav 2 (Sth)'], ['7.45', 'Jav 2 (Sth)'], ['8.00', 'Jav 2 (Sth)'], ['8.15', 'Jav 2 (Sth)', 'pack-up'], ['8.30', '90m H (G)'], ['8.45', '100m H (B)']],
        '16-20': [['6.00', 'SP1, SP2'], ['6.15', 'SP1, SP2'], ['6.30', 'Tug of war'], ['6.45', 'Relay practice'], ['7.00', 'LJ1'], ['7.15', '400m'], ['7.30', '1500m W'], ['7.45', 'LJ1'], ['8.00', 'LJ1'], ['8.15', 'LJ1', 'pack-up'], ['8.30', 'Hurdles setup'], ['8.45', 'Hurdles setup'], ['9.00', '100m H']]
      }
    }
  ],
  /*
   * Published abbreviation → this guide's event. `detail` spells the code
   * out in words, because "D2 (G), D3 (B)" is unreadable to a first-season
   * age manager and the club's own key is a separate paragraph on a
   * separate page. Numbers after a field-event code are the FIELD POSITION
   * (D1 = the Discus 1 field), which is why they survive into `detail`
   * rather than being normalised away — "which discus circle" is the
   * question a coach standing on the grass actually has.
   */
  codes: {
    /* --- Discus ------------------------------------------------------- */
    'D1, D1A': { slug: 'discus', detail: 'Discus 1, plus the extra circle' },
    'D1, D2': { slug: 'discus', detail: 'Discus 1 and 2' },
    'D1A': { slug: 'discus', detail: 'Discus 1, extra circle' },
    'D1A, D3': { slug: 'discus', detail: 'Discus 1 (extra circle) and Discus 3' },
    'D2': { slug: 'discus', detail: 'Discus 2' },
    'D3': { slug: 'discus', detail: 'Discus 3' },
    'D1 (G), D3 (B)': { slug: 'discus', detail: 'Discus 1 (girls) · Discus 3 (boys)' },
    'D2 (G), D3 (B)': { slug: 'discus', detail: 'Discus 2 (girls) · Discus 3 (boys)' },
    'D2 (B), D3 (G)': { slug: 'discus', detail: 'Discus 2 (boys) · Discus 3 (girls)' },

    /* --- Shot put ----------------------------------------------------- */
    'SP1, SP2': { slug: 'shot-put', detail: 'Shot Put 1 and 2' },
    'SP3': { slug: 'shot-put', detail: 'Shot Put 3' },
    'SP3, SP3A': { slug: 'shot-put', detail: 'Shot Put 3, plus the extra circle' },

    /* --- Long jump ---------------------------------------------------- */
    'LJ1': { slug: 'long-jump', detail: 'Long Jump 1' },
    'LJ2, LJ3': { slug: 'long-jump', detail: 'Long Jump 2 and 3' },

    /* --- High jump ---------------------------------------------------- */
    'HJ1': { slug: 'high-jump', detail: 'High Jump 1' },
    'HJ2': { slug: 'high-jump', detail: 'High Jump 2' },
    'HJ1, HJ2': { slug: 'high-jump', detail: 'High Jump 1 and 2' },
    'HJ1 (practice only)': { slug: 'high-jump', detail: 'High Jump 1 · practice only' },
    'HJ practice': { slug: 'high-jump', detail: 'High Jump · practice, not scored' },
    'HJ (Sc)': { slug: 'high-jump', detail: 'High Jump · scissor' },
    'HJ3, HJ4 (Sc)': { slug: 'high-jump', detail: 'High Jump 3 and 4 · scissor' },

    /* --- Sprints ------------------------------------------------------ */
    '50m': { slug: 'sprints', detail: '50m' },
    '70m': { slug: 'sprints', detail: '70m' },
    '100m': { slug: 'sprints', detail: '100m' },
    '200m': { slug: 'sprints', detail: '200m' },
    '200m*': { slug: 'sprints', detail: '200m · pack start' },
    '300m*': { slug: 'sprints', detail: '300m · pack start' },
    '400m': { slug: 'sprints', detail: '400m · 1 lap' },
    '400m*': { slug: 'sprints', detail: '400m · 1 lap · pack start' },
    '500m': { slug: 'sprints', detail: '500m' },
    '500m*': { slug: 'sprints', detail: '500m · pack start' },
    /* One cell, two events: the group runs the 100m and goes back to the
       shot put circles. `also` keeps Shot Put in tonight's selection even
       though the card links to the timed track event. */
    '100m / SP1, SP2': {
      slug: 'sprints',
      also: ['shot-put'],
      detail: '100m, then back to Shot Put 1 and 2'
    },

    /* --- Middle distance ---------------------------------------------- */
    '700m': { slug: 'middle-distance', detail: '700m' },
    '800m': { slug: 'middle-distance', detail: '800m · 2 laps to finish' },
    '1500m': { slug: 'middle-distance', detail: '1500m · 4 laps to finish' },
    '3000m': { slug: 'middle-distance', detail: '3000m · 8 laps to finish' },
    '800m / D2': {
      slug: 'middle-distance',
      also: ['discus'],
      detail: '800m, or Discus 2'
    },

    /* --- Race walk ----------------------------------------------------- */
    '700m W': { slug: 'race-walk', detail: '700m walk' },
    '1100m W': { slug: 'race-walk', detail: '1100m walk · 3 laps to finish' },
    '1500m W': { slug: 'race-walk', detail: '1500m walk · 4 laps to finish' },

    /* --- Hurdles ------------------------------------------------------- */
    '60m H': { slug: 'hurdles', detail: '60m hurdles' },
    '60m H (45cm)': { slug: 'hurdles', detail: '60m hurdles · 45cm' },
    '60m H (60cm)': { slug: 'hurdles', detail: '60m hurdles · 60cm' },
    '80m H': { slug: 'hurdles', detail: '80m hurdles' },
    '80m H (60cm)': { slug: 'hurdles', detail: '80m hurdles · 60cm' },
    '80m H (68cm)': { slug: 'hurdles', detail: '80m hurdles · 68cm' },
    '80m H (G) (76cm)': { slug: 'hurdles', detail: '80m hurdles (girls) · 76cm' },
    '80m H (G) / 90m H (B)': {
      slug: 'hurdles',
      detail: '80m hurdles (girls) · 90m hurdles (boys)'
    },
    '90m H (G)': { slug: 'hurdles', detail: '90m hurdles (girls)' },
    '90m H (B) (76cm)': { slug: 'hurdles', detail: '90m hurdles (boys) · 76cm' },
    '90m H (G) (76cm)': { slug: 'hurdles', detail: '90m hurdles (girls) · 76cm' },
    '100m H': { slug: 'hurdles', detail: '100m hurdles' },
    '100m H (76cm)': { slug: 'hurdles', detail: '100m hurdles · 76cm' },
    '100m H (B)': { slug: 'hurdles', detail: '100m hurdles (boys)' },
    '100m H (B) (76cm)': { slug: 'hurdles', detail: '100m hurdles (boys) · 76cm' },
    '200mH': { slug: 'hurdles', detail: '200m hurdles' },
    '300mH': { slug: 'hurdles', detail: '300m hurdles' },
    '400mH': { slug: 'hurdles', detail: '400m hurdles' },
    '400mH (G)': { slug: 'hurdles', detail: '400m hurdles (girls)' },
    '400mH (B)': { slug: 'hurdles', detail: '400m hurdles (boys)' },
    'Jav 1 (Nth) / 400m H': {
      slug: 'hurdles',
      detail: 'Javelin 1 (north end), or 400m hurdles'
    },

    /* --- Relay --------------------------------------------------------- */
    'Relay practice': { slug: 'relay', detail: 'Relay practice' },

    /*
     * Vortex. The club programs a vortex howler for the younger and middle
     * age groups; this guide's own lead-up throw is the turbo javelin. They
     * are not the same implement, so the card says so — but it points at the
     * turbo-javelin page, because that is the throw being taught and the
     * page is genuinely the right coaching material. Do not "tidy" this into
     * a plain Turbo Javelin label.
     */
    'Vortex': {
      slug: 'turbo-javelin',
      detail: 'Vortex howler — same lead-up throw as turbo javelin'
    },

    /* --- No page in this U10 guide ------------------------------------- */
    /* The club runs these; this guide has none of them. `name` is required
       because there is no event record to read one from. Kept rather than
       dropped, so a coach reading an older age group's night doesn't see a
       program with silent holes in it. */
    'TJ1': { slug: null, name: 'Triple Jump', detail: 'Triple Jump 1' },
    'TJ2, TJ3': { slug: null, name: 'Triple Jump', detail: 'Triple Jump 2 and 3' },
    'TJ1 or HJ1 (practice only)': {
      slug: null,
      name: 'Triple Jump or High Jump',
      detail: 'Triple Jump 1, or High Jump 1 for practice'
    },
    /* Deliberately NOT mapped to 'turbo-javelin' — the club's "Jav" is the
       real javelin, a different implement from this guide's lead-up skill. */
    'Jav 1': { slug: null, name: 'Javelin', detail: 'Javelin 1' },
    'Jav 2': { slug: null, name: 'Javelin', detail: 'Javelin 2' },
    'Jav 1 (Nth)': { slug: null, name: 'Javelin', detail: 'Javelin 1, north end' },
    'Jav 2 (Sth)': { slug: null, name: 'Javelin', detail: 'Javelin 2, south end' },
    'Tug of war': { slug: null, name: 'Tug of war', detail: 'Tug of war' },
    'Hurdles setup': {
      slug: null,
      name: 'Hurdles setup',
      detail: 'Set the hurdles up for the next race'
    }
  },
  copy: {
    programLabel: 'Program',
    ageLabel: 'Age group',
    lead:
      'Pick tonight’s program and your age group. The guide shows just those ' +
      'events, in the order they run.',
    runningOrderLead:
      'Tonight’s events, in the order they run. Switch to Everything to see ' +
      'the full guide.',
    packUpFlag: 'Pack up field equipment after this',
    noGuideFlag: 'Not in this guide — no coaching page yet',
    /* No program is in this state today — every grid A–F is transcribed.
       Kept for the next program the club runs before we have its grid. */
    missingProgram: (name) => `${name} isn’t loaded yet.`,
    missingProgramNote:
      'That program hasn’t been copied across from the club’s grid yet.',
    missingAge: (programName, ageName) =>
      `${programName} has nothing listed for ${ageName}.`,
    sourceLink: 'Open the club’s program page',

    /*
     * Spoken through the same `#tonight-status` live region every other
     * Tonight-mode change uses (interactions.js's announce()). Changing
     * either select rewrites the whole list under it — a substantial change
     * of context — so it has to be announced, not just painted. Functions
     * rather than strings because all three interpolate; same reason
     * tonightCopy's toggle announcements are functions.
     */
    changedAnnouncement: (programName, ageName, count) =>
      `${programName}, ${ageName}. ${count} event${count === 1 ? '' : 's'} in ` +
      'tonight’s running order.',
    unavailableAnnouncement: (programName, ageName) =>
      `${programName}, ${ageName}. Nothing to show for that choice.`,
    clearedAnnouncement:
      'Program not set. Showing your own selection.'
  }
};

/**
 * Tonight's running order for one program + age group.
 *
 * Consecutive slots carrying the SAME code are merged into one block, so a
 * high jump rotation that occupies 6.30, 6.45 reads as one "6.30–7.00pm"
 * card rather than two identical cards — but a rotation the coach LEAVES
 * and comes back to (U10 in Program A leaves high jump for the 70m at 7.00,
 * then returns at 7.15) stays as two blocks, because that is genuinely two
 * trips across the field.
 *
 * Never throws on unknown input: an unknown program or age id, or a program
 * whose grid has not been transcribed, each returns its own `status` with an
 * empty `blocks` array. Callers render the matching empty state rather than
 * an empty night that looks like a real one.
 *
 * @param {string} programId  a `weeklyProgram.programs[].id`
 * @param {string} ageId      a `weeklyProgram.ageGroups[].id`
 * @returns {{status: string, program: object|null, ageGroup: object|null, blocks: object[]}}
 *   status is one of 'ok' | 'unknown-program' | 'unknown-age' |
 *   'program-not-loaded' | 'age-not-listed'.
 */
export function getRunningOrder(programId, ageId) {
  const program = weeklyProgram.programs.find((p) => p.id === programId) || null;
  const ageGroup = weeklyProgram.ageGroups.find((a) => a.id === ageId) || null;
  const empty = (status) => ({ status, program, ageGroup, blocks: [] });

  if (!program) return empty('unknown-program');
  if (!ageGroup) return empty('unknown-age');
  if (!program.slots) return empty('program-not-loaded');

  const slots = program.slots[ageGroup.id];
  if (!Array.isArray(slots) || slots.length === 0) return empty('age-not-listed');

  const merged = [];
  slots.forEach(([time, code, marker]) => {
    const last = merged.length ? merged[merged.length - 1] : null;
    if (last && last.code === code) {
      last.end = time;
      last.span += 1;
      last.packUp = last.packUp || marker === 'pack-up';
      return;
    }
    merged.push({ code, start: time, end: time, span: 1, packUp: marker === 'pack-up' });
  });

  const blocks = merged.map((block) => {
    const entry = weeklyProgram.codes[block.code];
    const event = entry.slug ? getEvent(entry.slug) : null;
    const glance = entry.slug
      ? eventsAtAGlance.rows.find((r) => r.slug === entry.slug)
      : null;
    // A merged block runs until the START of the slot AFTER its last one.
    const until = weeklyProgram.slotOrder[weeklyProgram.slotOrder.indexOf(block.end) + 1];
    return {
      code: block.code,
      slug: entry.slug,
      // Second event named by the same cell, if any — see `also` in codes.
      also: entry.also || [],
      name: event ? event.name : entry.name,
      detail: entry.detail,
      // Column 2 of the at-a-glance table is the key U10 rule — read, never
      // re-typed, so the two surfaces can't drift.
      rule: glance ? glance.cells[2] : '',
      time: block.span > 1 ? `${block.start}–${until}pm` : `${block.start}pm`,
      packUp: block.packUp
    };
  });

  return { status: 'ok', program, ageGroup, blocks };
}

/** Every guide event slug on one program + age group's night, de-duplicated
 *  and in running order. This is what drives Tonight-mode filtering on the
 *  Games and Rules tabs — see js/tonight.js's setProgramChoice(). Codes with
 *  no page in this guide (Triple Jump, Javelin) contribute nothing. */
export function getProgramEventSlugs(programId, ageId) {
  const { blocks } = getRunningOrder(programId, ageId);
  const slugs = [];
  blocks.forEach((block) => {
    if (block.slug) slugs.push(block.slug);
    // A cell naming two events contributes both, even though the card links
    // to only one of them — otherwise the Games and Rules tabs would filter
    // that second event out of a night the club actually runs it on.
    block.also.forEach((slug) => slugs.push(slug));
  });
  return [...new Set(slugs)];
}

/* ------------------------------------------------------------------ */
/* Waiting-Period Games (PDF pages 19–21)                              */
/*                                                                     */
/* Each item carries a `slug` (route target for its detail page), a    */
/* `summary` (one sentence, shown on the Games list) and a `bullets`   */
/* array (the full step-by-step instructions, shown on the game's own  */
/* detail page — js/views/gameDetail.js). These were re-split from the */
/* single `description` string every item used to carry (removed as   */
/* part of the Games-tab redesign): every fact and instruction that    */
/* was in the prose is preserved, just reorganised into a lead sentence*/
/* plus its supporting steps, nothing invented or dropped.             */
/* ------------------------------------------------------------------ */

export const games = {
  heading: 'Waiting-Period Games',
  categories: [
    {
      id: 'reaction-start',
      name: 'Reaction & Start Games',
      kicker: 'Skill Games',
      // Tonight-mode linkage: which events this category's games rehearse.
      eventSlugs: ['sprints', 'relay'],
      items: [
        {
          name: 'Cone Clean-Up Race',
          slug: 'cone-clean-up-race',
          gear: 'Cones',
          summary:
            'A cone-collection relay against the clock that sneaks in standing-start ' +
            'reps between rounds.',
          bullets: [
            'Scatter 20–30 cones/domes across a square area with a bin in two opposite corners.',
            'On “go”, athletes run one cone at a time to either bin, then reset and race the clock again.',
            'Between rounds, teach a standing start and have athletes use it to launch into the next round – a clean way to sneak in start-position reps disguised as a game.'
          ],
          // Item-level linkage for Tonight-tab grouping — a separate join
          // from this category's own eventSlugs above (see the comment on
          // relay-baton's eventSlugs below for why the two must not be
          // conflated).
          eventSlugs: ['sprints'],
          // Reference-video keys for this game's honesty-framed video block
          // (Games route only — see AC44–AC52 / §11 Q4 in SPEC.md). `prefix`
          // is the plain technique/event name resourceCard shows before the
          // video's own title; it is NOT a new video and does not appear in
          // `resources` — it only labels one that already does.
          videoResources: [{ key: 'video-standing-start', prefix: 'Standing Start' }]
        },
        {
          name: 'Hoop Monster',
          slug: 'hoop-monster',
          gear: 'Hoops',
          summary:
            'A game of musical hoops that doubles as a waiting-turn management system ' +
            'and rehearses reactive sprinting.',
          bullets: [
            'Athletes wait safely inside a hoop each – their “safe base” while waiting for a turn at an event.',
            'When the “monster” (coach or a nominated athlete) has their back turned, everyone must sprint to a different free hoop without being tagged.',
            'Directly rehearses reactive sprinting off a stationary position, and doubles as your waiting-turn management system.'
          ],
          eventSlugs: ['sprints'],
          videoResources: [{ key: 'video-standing-start', prefix: 'Standing Start' }]
        },
        {
          name: 'Red Light, Green Light',
          slug: 'red-light-green-light',
          gear: 'Cones',
          summary:
            'A stop-start reaction game that channels the classic call-and-response ' +
            'game into sprint-start discipline.',
          bullets: [
            'Athletes line up on a start line marked with cones; the coach calls “green light” to sprint forward and “red light” to stop instantly, still and balanced.',
            'Anyone who moves after “red light”, or doesn’t stop in a solid, ready position, goes back to the start.',
            'Directly rehearses the drive-away reaction and the “wait for it” discipline a legal standing start needs.'
          ],
          eventSlugs: ['sprints'],
          videoResources: [{ key: 'video-standing-start', prefix: 'Standing Start' }]
        }
      ]
    },
    {
      id: 'distance',
      name: 'Pacing & Endurance Games',
      kicker: 'Skill Games',
      eventSlugs: ['middle-distance', 'race-walk'],
      items: [
        {
          name: 'Pace Partners',
          slug: 'pace-partners',
          gear: 'Stopwatch',
          summary:
            'A partnered pacing game where one athlete sets a steady speed and the ' +
            'other learns to match it.',
          bullets: [
            'Pair athletes up; one leads a lap at a steady “conversation pace” while the partner stays exactly alongside without overtaking.',
            'Swap roles each lap so both athletes practise setting and following an even pace.',
            'Builds the even-pacing instinct that stops the classic “sprint the first 100m and fade” mistake.'
          ],
          eventSlugs: ['middle-distance'],
          videoResources: [{ key: 'video-running-technique', prefix: 'Running Technique' }]
        },
        {
          name: 'Traffic Light Pace',
          slug: 'traffic-light-pace',
          gear: 'Cones',
          summary:
            'A colour-coded jogging game that trains athletes to change pace on ' +
            'command without losing form.',
          bullets: [
            'Mark a loop with cones; call out “cruise”, “push” or “sprint” and athletes adjust their pace to match, keeping tall running posture throughout.',
            'Mix up the calls so nobody can predict the next change – this rehearses the controlled pace changes needed for the 400m and 800m.',
            'Finish every round on “cruise” so athletes leave the game recovered, not gassed.'
          ],
          eventSlugs: ['middle-distance']
        },
        {
          name: 'Breathing Ladder',
          slug: 'breathing-ladder',
          gear: null,
          summary:
            'A jog-and-count game that grooves rhythmic breathing under mild fatigue.',
          bullets: [
            'Athletes jog in a loose group, counting two steps in, two steps out on the coach’s cue.',
            'Every 30 seconds, add one more step to the count (three in/three out, then four), easing the pace slightly to keep it manageable.',
            'Reinforces the controlled breathing rhythm that fixes early-panic breathing, a common fault in new 800m runners.'
          ],
          eventSlugs: ['middle-distance']
        },
        {
          name: 'Straight-Leg Statues',
          slug: 'straight-leg-statues',
          gear: null,
          summary:
            'A freeze-and-check game that grooves the straight-leg-at-contact rule ' +
            'with zero speed pressure.',
          bullets: [
            'Athletes walk slowly around a marked area; on “freeze”, they stop mid-stride and hold the position.',
            'The coach checks each athlete’s front leg is straight at the knee – anyone bent gently resets before continuing.',
            'Isolates the single most common reason for a caution, with no speed to distract from it.'
          ],
          eventSlugs: ['race-walk'],
          videoResources: [{ key: 'video-racewalking', prefix: 'Race Walk' }]
        },
        {
          name: 'Hip Roll Follow-the-Leader',
          slug: 'hip-roll-follow-the-leader',
          gear: null,
          summary:
            'A follow-the-leader walking game that exaggerates the hip roll behind ' +
            'legal race-walk speed.',
          bullets: [
            'Athletes form a line behind a leader who exaggerates the hip roll while keeping technique legal.',
            'Every 20m, the back athlete moves to the front and becomes the new leader, so everyone gets a turn setting the technique.',
            'Makes “speed comes from the hips, not longer strides” something athletes can copy, not just hear.'
          ],
          eventSlugs: ['race-walk']
        },
        {
          name: 'Silent Judge',
          slug: 'silent-judge',
          gear: null,
          summary:
            'A peer-judging game that trains athletes to spot the loss-of-contact ' +
            'fault themselves.',
          bullets: [
            'Pair athletes up; one walks a short course while the other watches only for “creeping” (a visible loss of ground contact).',
            'The judge silently raises a hand the moment they see a loss of contact, and the walker resets pace without stopping.',
            'Builds the same self-awareness a real race-walk judge rewards – athletes learn to feel the fault before it happens.'
          ],
          eventSlugs: ['race-walk']
        }
      ]
    },
    {
      id: 'hurdles-games',
      name: 'Hurdle Games',
      kicker: 'Skill Games',
      eventSlugs: ['hurdles'],
      items: [
        {
          name: 'Step-Over Puddles',
          slug: 'step-over-puddles',
          gear: 'Low hurdles',
          summary:
            'A walk-through hurdle mobility game that uses imaginary puddles to ' +
            'groove the lead-leg action.',
          bullets: [
            'Lay 4–6 hurdles flat or on their lowest setting in a line.',
            'Athletes walk the line calling “step over the puddle!” as they drive the lead knee up and through, not jumping.',
            'A slow, no-pressure way to bank lead-leg reps before adding any real hurdling speed.'
          ],
          eventSlugs: ['hurdles'],
          videoResources: [{ key: 'video-hurdles', prefix: 'Hurdles' }]
        },
        {
          name: 'Rhythm Claps',
          slug: 'rhythm-claps',
          gear: 'Low hurdles',
          summary:
            'A clap-along hurdling game that grooves a consistent stride pattern ' +
            'between flights.',
          bullets: [
            'Set 3–4 low hurdles with even spacing; the group claps a steady beat as each athlete goes through.',
            'Athletes aim to match one clap per stride, landing on the same beat at each hurdle to find a consistent rhythm.',
            'Turns “settle on an odd stride count” into something athletes can feel and hear, not just think about.'
          ],
          eventSlugs: ['hurdles']
        }
      ]
    },
    {
      id: 'jump',
      name: 'Jump Games',
      kicker: 'Skill Games',
      eventSlugs: ['long-jump', 'high-jump'],
      items: [
        {
          name: 'Step-and-Stick Ladder',
          slug: 'step-and-stick-ladder',
          gear: 'Markers',
          summary:
            'A marker ladder into the long jump pit that grooves a consistent run-up ' +
            'stride pattern.',
          bullets: [
            'Lay markers at increasing gaps leading into the long jump pit.',
            'Athletes walk, then jog, then run the ladder, landing on each marker in turn before a final jump into the pit.',
            'Reinforces a consistent first-few-strides pattern – the single most common fix for an inconsistent long jump run-up.'
          ],
          eventSlugs: ['long-jump'],
          videoResources: [{ key: 'video-long-jump', prefix: 'Long Jump' }]
        },
        {
          name: 'Standing Jump Challenge',
          slug: 'standing-jump-challenge',
          gear: 'Markers',
          summary:
            'A two-feet-to-two-feet distance game that builds the arm swing and soft ' +
            'landing before any run-up exists.',
          bullets: [
            'Mark a start line and have athletes standing-jump for distance, landing feet together with knees bent (“land like a frog”).',
            'Mark each athlete’s best landing spot and let them try to beat it over 3–4 attempts.',
            'Builds the exact arm-swing and landing habits the beginner progression starts with, with no run-up to manage.'
          ],
          eventSlugs: ['long-jump']
        },
        {
          name: 'Take-Off Foot Finder',
          slug: 'take-off-foot-finder',
          gear: 'Markers',
          summary:
            'A short-approach game that helps athletes lock in their natural take-off ' +
            'foot before formalising a run-up.',
          bullets: [
            'Set a marker 4–6 strides from the pit; athletes jog in and take off from whichever foot feels natural, landing on two feet.',
            'Note which foot each athlete favours over several turns – most will show a clear, consistent preference.',
            'Confirms the take-off foot before any run-up is formalised, avoiding a habit that’s hard to unlearn later.'
          ],
          eventSlugs: ['long-jump']
        },
        {
          name: 'Scissor Steps (no bar)',
          slug: 'scissor-steps-no-bar',
          gear: 'High jump mat',
          summary:
            'A no-bar, no-pressure drill for grooving the high jump approach angle and ' +
            'take-off leg.',
          bullets: [
            'In pairs, athletes take turns running in at a 30-degree angle and stepping straight up onto the high jump mat.',
            'No bar, no pressure – just grooving the approach angle and take-off leg while others wait their turn nearby.'
          ],
          eventSlugs: ['high-jump'],
          videoResources: [{ key: 'video-high-jump', prefix: 'High Jump' }]
        },
        {
          name: 'Angle Approach Race',
          slug: 'angle-approach-race',
          gear: 'Markers',
          summary:
            'A marked-angle running game that grooves the 30–40 degree approach line ' +
            'before any bar is added.',
          bullets: [
            'Lay a marked line on the ground at roughly 30–40 degrees to where the bar would sit.',
            'Athletes take turns running the line at increasing pace, stepping onto the mat at the end without a bar present.',
            'Locks in the approach angle early – the single biggest technical building block for a legal scissor jump.'
          ],
          eventSlugs: ['high-jump']
        },
        {
          name: 'Kick and Land',
          slug: 'kick-and-land',
          gear: null,
          summary:
            'A standing drill game that isolates the outside-leg take-off and ' +
            'inside-leg kick before adding a run-in.',
          bullets: [
            'Athletes stand side-on to the mat and practise kicking the inside leg up and over an imaginary bar, landing on the mat.',
            'The coach gives an instant clap or call the moment the kicking leg is straight – quick feedback on the “bent-knee drive” fault.',
            'A slow-motion, no-run-in way to bank leg-action reps between turns at the real bar.'
          ],
          eventSlugs: ['high-jump']
        }
      ]
    },
    {
      id: 'throwing',
      name: 'Throwing Games',
      kicker: 'Skill Games',
      eventSlugs: ['shot-put', 'discus', 'turbo-javelin'],
      items: [
        {
          name: 'Target Hoops',
          slug: 'target-hoops',
          gear: 'Hoops',
          summary:
            'A target-accuracy throwing game that rewards control over raw power.',
          bullets: [
            'Set out hoops as targets roughly 8–10m from a throwing line.',
            'In pairs or small groups, athletes take turns trying to land a shot, discus or turbo jav inside a hoop on the full.',
            'Works for any throwing event and rewards control over raw power – exactly what beginners need most.'
          ],
          sourcePrefix: 'Adapted from',
          resource: 'article-throwing-game',
          eventSlugs: ['shot-put', 'discus', 'turbo-javelin'],
          videoResources: [
            { key: 'video-shot-put', prefix: 'Shot Put' },
            { key: 'video-discus', prefix: 'Discus' },
            { key: 'video-javelin', prefix: 'Turbo Javelin' }
          ]
        },
        {
          name: 'Neck Push Line',
          slug: 'neck-push-line',
          gear: null,
          summary:
            'A close-range, no-throw game that grooves the shot’s “push, don’t throw” ' +
            'action.',
          bullets: [
            'Athletes stand in pairs an arm’s length apart, shot tucked under the jaw, and gently push the shot into a partner’s waiting hands.',
            'No arc, no distance – just a straight-line push repeated until the “push off the neck” motion feels natural.',
            'Removes the temptation to throw the shot like a ball, since there’s no distance to chase yet.'
          ],
          eventSlugs: ['shot-put'],
          videoResources: [{ key: 'video-shot-put', prefix: 'Shot Put' }]
        },
        {
          name: 'Grid Put',
          slug: 'grid-put',
          gear: 'Markers',
          summary:
            'A scoring-zone put game that rewards a full, balanced finish over raw ' +
            'distance.',
          bullets: [
            'Mark three scoring zones at increasing distance from the circle with cones or chalk lines.',
            'Athletes score points for the zone their put lands in, with bonus points for finishing “thumb down” in full extension.',
            'Rewards good technique at the finish, not just how far the shot travels.'
          ],
          eventSlugs: ['shot-put']
        },
        {
          name: 'Sandwich Freeze',
          slug: 'sandwich-freeze',
          gear: null,
          summary:
            'A grip-and-hold game that locks in the “discus sandwich” starting ' +
            'position before any throwing begins.',
          bullets: [
            'In pairs, athletes hold the discus in the two-handed “sandwich” grip and freeze in the side-on starting position on the coach’s call.',
            'Partners check each other’s grip – fingers spread evenly, no tight palming – before swapping roles.',
            'Builds the starting position into muscle memory so it’s automatic once real throws begin.'
          ],
          eventSlugs: ['discus'],
          videoResources: [{ key: 'video-discus', prefix: 'Discus' }]
        },
        {
          name: 'Spin Check',
          slug: 'spin-check',
          gear: null,
          summary:
            'A short-range release game that trains a clean, flat spin off the index ' +
            'finger.',
          bullets: [
            'From a standing position close to a fence or net, athletes release the discus with a gentle flick, aiming for the flattest, longest spin they can see.',
            'A wobbling discus means the grip or release needs resetting; a wobble-free spin means it’s ready for full-distance throws.',
            'Gives athletes an instant, visible signal for good technique instead of relying on distance alone.'
          ],
          eventSlugs: ['discus']
        },
        {
          name: 'Cricket Arm Check',
          slug: 'cricket-arm-check',
          gear: null,
          summary:
            'A no-implement mimic game that locks in the overarm throwing action ' +
            'before any turbo jav is picked up.',
          bullets: [
            'Athletes mimic a cricket or tennis overarm throw in slow motion, side-on with the non-throwing arm pointing at the target.',
            'The coach checks each athlete’s arm path is overarm, not side-arm, before they progress to throwing the real implement.',
            'Fixes the most common turbo jav fault – throwing side-arm like a discus – before it becomes a habit.'
          ],
          eventSlugs: ['turbo-javelin'],
          videoResources: [{ key: 'video-javelin', prefix: 'Turbo Javelin' }]
        },
        {
          name: 'Fan Zone Distance',
          slug: 'fan-zone-distance',
          gear: 'Markers',
          summary:
            'A marshalled distance game that rewards a safe, confident overarm ' +
            'release in a single throwing direction.',
          bullets: [
            'Mark a wide, fan-shaped landing area with cones; only one athlete throws at a time, everyone else waits behind the line.',
            'Athletes take turns throwing for distance, with the marker moved out each time someone beats the current best.',
            'Keeps throws safe and single-direction while still making distance progress feel like a game.'
          ],
          eventSlugs: ['turbo-javelin']
        }
      ]
    },
    {
      id: 'relay-baton',
      name: 'Relay & Baton Games',
      kicker: 'Skill Games',
      // Category-level linkage — drives GAMES-TAB CATEGORY VISIBILITY only
      // (which category sections show under Tonight-mode filtering). Stays
      // ['relay'] per authoritative instruction: hurdles is deliberately NOT
      // added here even though the Hurdles Shuttle Relay item below lives in
      // this category. Do not "fix" this by adding 'hurdles' — that
      // instruction stands.
      //
      // This is a SEPARATE join from each item's own item-level `eventSlugs`
      // below, which drives TONIGHT-TAB EVENT↔GAME GROUPING and is not
      // required to be a subset of this category-level value. Hurdles
      // Shuttle Relay's item-level `eventSlugs: ['hurdles', 'relay']`
      // deliberately includes 'hurdles' so it groups under the Hurdles event
      // block on the Tonight tab, without touching this category-level list
      // or the standing instruction above.
      eventSlugs: ['relay'],
      items: [
        {
          name: 'Baton Down the Line',
          slug: 'baton-down-the-line',
          gear: 'Baton',
          summary:
            'A hand-to-hand baton relay with zero running, ideal for a tight waiting area.',
          bullets: [
            'Teams line up single-file, an arm’s length apart, facing forward with their receiving hand held back.',
            'On “go”, the baton is passed hand-to-hand down the line without anyone turning around; first team to raise the baton at the front wins the round.',
            'Pure non-visual exchange practice, with zero running required.'
          ],
          resource: 'article-relay-games',
          eventSlugs: ['relay']
          // No videoResources: no baton-change video exists in `resources` —
          // this game's only resource is the article above. Rendering no
          // video block is deliberate (AC47), not an omission.
        },
        {
          name: 'Zone Tag',
          slug: 'zone-tag',
          gear: 'Cones',
          summary:
            'A go-mark reaction game that teaches receivers exactly when to start ' +
            'moving in the take-over zone.',
          bullets: [
            'Mark a take-over zone with cones and a go-mark a few strides inside it.',
            'The “incoming runner” jogs in; the receiver must start moving the instant the incoming runner’s foot touches the go-mark, not before.',
            'Rehearses the timing skill that prevents both early (illegal) and late (slow) baton exchanges.'
          ],
          eventSlugs: ['relay']
        },
        {
          name: 'Hurdles Shuttle Relay',
          slug: 'hurdles-shuttle-relay',
          gear: 'Hurdles',
          summary:
            'A shuttle relay over low hurdles that combines hurdle rhythm with relay-tag fun.',
          bullets: [
            'Two lines of low hurdles set up shuttle-relay style.',
            'Athletes clear a short line of hurdles, tag a teammate, who clears them back the other way.',
            'Works even with only two or three hurdles per lane.'
          ],
          resource: 'article-hurdles-shuttle',
          eventSlugs: ['hurdles', 'relay'],
          videoResources: [{ key: 'video-hurdles', prefix: 'Hurdles' }]
        }
      ]
    },
    {
      id: 'just-for-fun',
      name: 'The 10%: Just for Fun',
      kicker: 'Used sparingly',
      // No event linkage by design — always shown regardless of tonight's
      // selection, so this flag is checked instead of special-casing the id
      // string anywhere in view code.
      alwaysShow: true,
      items: [
        {
          name: 'Freeze Tag',
          slug: 'freeze-tag',
          // No gear: needs nothing but players, so no pill renders (see
          // gameListItem() in js/views/games.js).
          gear: null,
          summary:
            'A classic no-skill-agenda tag game, kept short and used sparingly.',
          bullets: [
            'One or two “taggers” try to freeze everyone else with a tag; a frozen player can be unfrozen by a teammate crawling through their legs.',
            'Typically used at the very end of a session, or if energy and attention have completely dropped.',
            'This is the 10% – pure fun, no drills attached, and all the more valued for being the exception.'
          ],
          // Present and empty, not omitted — "deliberately unlinked" must be
          // distinguishable from "forgotten" (AC36). No videoResources either:
          // this game is explicitly "pure fun, no drills attached", so there
          // is no honest technique video to attach (AC47).
          eventSlugs: []
        }
      ]
    }
  ],
  // Verbatim copy for the honesty-framed video block on a game's OWN detail
  // page (js/views/gameDetail.js's "Watch & Learn" section) wherever a game
  // has videoResources — moved there from the Games list page as part of the
  // Games-tab redesign (item 6/7): the list page no longer inlines any video.
  // These strings must appear verbatim (§7.7 / AC49) so a coach can never
  // mistake an official event-technique video for footage of this specific
  // game.
  videoBlockCopy: {
    heading: 'Technique this game rehearses',
    clarifier:
      'These are official coaching videos of the underlying event technique, ' +
      'not footage of this game.'
  }
};

/* ------------------------------------------------------------------ */
/* Full Resource Library (PDF pages 23–24)                             */
/* ------------------------------------------------------------------ */

export const library = {
  heading: 'Full Resource Library',
  intro:
    'Every video and article used in this guide, gathered in one place for quick ' +
    'reference.',
  /* [resource key, context prefix shown before the resource title] */
  entries: [
    ['video-standing-start', 'Standing Start & Sprints'],
    ['video-running-technique', 'Standing Start & Sprints'],
    ['video-running-technique', 'Middle Distance Running'],
    ['video-hurdles', 'Hurdles'],
    ['article-relay-changes', '4 x 100m Relay & Baton Change'],
    ['video-racewalking', 'Race Walk'],
    ['video-long-jump', 'Long Jump'],
    ['article-long-jump-run-up', 'Long Jump'],
    ['video-high-jump', 'High Jump (Scissor Technique)'],
    ['article-scissors-high-jump', 'High Jump (Scissor Technique)'],
    ['video-shot-put', 'Shot Put'],
    ['article-shot-put', 'Shot Put'],
    ['video-discus', 'Discus'],
    ['article-discus', 'Discus'],
    ['video-javelin', 'Bonus: Turbo Javelin (Lead-Up Skill)'],
    ['article-throwing-game', 'Target Hoops'],
    ['article-relay-games', 'Baton Down the Line'],
    ['article-hurdles-shuttle', 'Hurdles Shuttle Relay'],
    ['article-3-words', 'Waiting-Period Games'],
    ['article-laa-video-hub', 'Reference'],
    ['article-laa-rules', 'Reference'],
    ['article-cya-blog', 'Reference']
  ]
};

/* ------------------------------------------------------------------ */
/* Tonight-mode UI copy                                                */
/*                                                                     */
/* Same rule as every other word in this app (see the file header):    */
/* views render this, they don't hard-code it. Grouped separately from */
/* the guide content above because this is app-interface copy (picker, */
/* empty states, mode-dependent leads), not transcribed guide content.  */
/* ------------------------------------------------------------------ */
export const tonightCopy = {
  // Shown wherever Tonight-mode filtering leaves a page with nothing to
  // show (Events, Rules, and the Tonight tab's own summary).
  emptyState: 'No events picked yet for tonight.',
  chooseEventsCta: 'Choose tonight\'s events',
  editSelectionCta: 'Edit selection',
  events: {
    filteredLead: 'Tonight’s events only. Switch to Everything to see the full list.',
    everythingLead:
      'Ten events, each with a quick-facts snapshot, beginner → intermediate ' +
      'progression, common faults, a safety note and its video or article.',
    // Shown on the Events tab when mode === 'tonight' but nothing has been
    // picked yet, so the full list never appears next to an unexplained
    // "Tonight" reading on the mode switch (AC34).
    emptySelectionNote:
      'Nothing is picked for tonight yet, so the full list is showing.',
    /*
     * Per-card toggle announcement templates (AC32) — functions, not bare
     * strings, because the message must interpolate the specific event's
     * name and the resulting live selection count; every other word in
     * `tonightCopy` is static because it doesn't need to. Called from
     * interactions.js's handleClick after js/tonight.js's
     * toggleTonightEvent() has already mutated and persisted the selection,
     * so `count` is the up-to-date total.
     */
    toggleOnAnnouncement: (name, count) =>
      `${name} added to tonight’s events. ${count} event${
        count === 1 ? '' : 's'
      } selected for tonight.`,
    toggleOffAnnouncement: (name, count) =>
      `${name} removed from tonight’s events. ${count} event${
        count === 1 ? '' : 's'
      } selected for tonight.`
  },
  games: {
    filteredNote:
      'Showing games for tonight’s selected events, plus the games with no fixed event.'
  },
  eventDetail: {
    notTonightFlag: 'Not in tonight’s selection.'
  },
  picker: {
    legend: 'Which events are on tonight\'s program?',
    note:
      'Most sessions run 2–4 events. You can change this any time from the ' +
      'Tonight tab.',
    saveLabel: 'Save selection',
    cancelLabel: 'Cancel',
    skipLabel: 'Skip for now'
  },
  view: {
    pickerLead:
      'Pick the events on tonight’s program and the guide filters itself to just those.',
    summaryLead: 'Tonight’s program, filtered from the full guide.'
  }
};

/* ------------------------------------------------------------------ */
/* Structural-integrity guard — Tonight-mode linkage                   */
/*                                                                     */
/* games.categories[].eventSlugs and eventsAtAGlance.rows[].slug are   */
/* hand-written joins against `events`. A typo here would silently     */
/* filter a whole category or row out of Tonight mode instead of       */
/* failing loudly, so check every slug against the real event list     */
/* once, at module load, and throw immediately if one doesn't exist.   */
/*                                                                     */
/* Typos aren't the only way this can silently mis-filter: deleting a  */
/* row from eventsAtAGlance.rows (or duplicating one) passes the       */
/* per-slug check above just as easily, and Tonight mode would quietly */
/* drop that event from the Rules table with no error at all. So this  */
/* also asserts *completeness* — one row per event, no more, no fewer, */
/* no duplicate slugs — not just that every declared slug resolves.    */
/*                                                                     */
/* Extended for the Tonight-tab event↔game grouping and the honesty-   */
/* framed reference videos (Games/Rules): every game item must declare */
/* an eventSlugs array (present, possibly empty — "deliberately        */
/* unlinked" must be distinguishable from "forgotten"), every declared */
/* item-level slug must be real, and every resource key referenced     */
/* from a game item's `resource`/`videoResources`, an ageGroupFacts    */
/* fact, or an eventsAtAGlance row must exist in `resources` — with    */
/* video-specific references (`videoResources`, and the rule-video     */
/* `resource` on a fact/row) additionally required to point at a       */
/* resource whose kind is 'video'. Item-level eventSlugs is NOT        */
/* required to be a subset of its category's eventSlugs — the two are  */
/* separate joins for separate purposes (see the comment on            */
/* relay-baton's eventSlugs above).                                    */
/*                                                                     */
/* Extended again for the Events-tab discipline grouping and the       */
/* Games-tab detail-page redesign: eventCategories must partition      */
/* `events` exactly (one category per event, no more, no fewer, no     */
/* duplicates) the same way eventsAtAGlance.rows must, and every game   */
/* item must carry a non-empty, UNIQUE route `slug` plus a `summary`    */
/* and a non-empty `bullets` array — a missing/duplicate slug would     */
/* silently break or collide two different games' detail routes,       */
/* which must fail loudly here rather than at whichever coach happens   */
/* to tap the wrong link first.                                        */
/* ------------------------------------------------------------------ */
(function assertContentLinkage() {
  const knownSlugs = new Set(events.map((e) => e.slug));
  const problems = [];
  const gameSlugCounts = new Map();
  const eventCategorySlugCounts = new Map();

  /** A resource-key reference that MUST resolve, and (if isVideo) must be kind:'video'. */
  function checkResourceRef(key, where, isVideo) {
    const r = resources[key];
    if (!r) {
      problems.push(`${where} references unknown resource key '${key}'`);
    } else if (isVideo && r.kind !== 'video') {
      problems.push(
        `${where} references resource '${key}' with kind '${r.kind}', expected 'video'`
      );
    }
  }

  games.categories.forEach((cat) => {
    (cat.eventSlugs || []).forEach((slug) => {
      if (!knownSlugs.has(slug)) {
        problems.push(
          `games.categories['${cat.id}'].eventSlugs contains unknown slug '${slug}'`
        );
      }
    });

    (cat.items || []).forEach((item) => {
      const where = `games.categories['${cat.id}'] item '${item.name}'`;

      if (!Array.isArray(item.eventSlugs)) {
        problems.push(`${where} is missing an eventSlugs array`);
      } else {
        item.eventSlugs.forEach((slug) => {
          if (!knownSlugs.has(slug)) {
            problems.push(`${where}.eventSlugs contains unknown slug '${slug}'`);
          }
        });
      }

      if (item.resource) {
        checkResourceRef(item.resource, `${where}.resource`, false);
      }

      (item.videoResources || []).forEach((vr, i) => {
        const key = typeof vr === 'string' ? vr : vr && vr.key;
        if (!key) {
          problems.push(`${where}.videoResources[${i}] is missing a resource key`);
          return;
        }
        checkResourceRef(key, `${where}.videoResources[${i}]`, true);
      });

      if (!item.slug || typeof item.slug !== 'string') {
        problems.push(`${where} is missing a route slug`);
      } else {
        gameSlugCounts.set(item.slug, (gameSlugCounts.get(item.slug) || 0) + 1);
      }
      if (!item.summary || typeof item.summary !== 'string') {
        problems.push(`${where} is missing a summary`);
      }
      if (!Array.isArray(item.bullets) || item.bullets.length === 0) {
        problems.push(`${where} is missing a non-empty bullets array`);
      }
    });
  });

  gameSlugCounts.forEach((count, slug) => {
    if (count > 1) {
      problems.push(`games has ${count} items sharing slug '${slug}' (duplicate)`);
    }
  });

  eventCategories.forEach((cat) => {
    cat.slugs.forEach((slug) => {
      if (!knownSlugs.has(slug)) {
        problems.push(`eventCategories['${cat.id}'] contains unknown slug '${slug}'`);
      }
      eventCategorySlugCounts.set(slug, (eventCategorySlugCounts.get(slug) || 0) + 1);
    });
  });
  eventCategorySlugCounts.forEach((count, slug) => {
    if (count > 1) {
      problems.push(`eventCategories place slug '${slug}' in ${count} categories (must be exactly one)`);
    }
  });
  knownSlugs.forEach((slug) => {
    if (!eventCategorySlugCounts.has(slug)) {
      problems.push(`eventCategories is missing event slug '${slug}'`);
    }
  });

  eventsAtAGlance.rows.forEach((row, i) => {
    if (!knownSlugs.has(row.slug)) {
      problems.push(
        `eventsAtAGlance.rows[${i}] has unknown slug '${row.slug}'`
      );
    }
    if (row.resource) {
      checkResourceRef(row.resource, `eventsAtAGlance.rows[${i}] ('${row.slug}').resource`, true);
    }
  });

  ageGroupFacts.facts.forEach((fact) => {
    if (fact.resource) {
      checkResourceRef(
        fact.resource,
        `ageGroupFacts.facts['${fact.label}'].resource`,
        true
      );
    }
  });

  if (eventsAtAGlance.rows.length !== events.length) {
    problems.push(
      `eventsAtAGlance.rows has ${eventsAtAGlance.rows.length} row(s) but ` +
        `events has ${events.length} — every event needs exactly one glance row`
    );
  }

  const rowSlugCounts = new Map();
  eventsAtAGlance.rows.forEach((row) => {
    rowSlugCounts.set(row.slug, (rowSlugCounts.get(row.slug) || 0) + 1);
  });
  rowSlugCounts.forEach((count, slug) => {
    if (count > 1) {
      problems.push(`eventsAtAGlance.rows has ${count} rows for slug '${slug}' (duplicate)`);
    }
  });
  knownSlugs.forEach((slug) => {
    if (!rowSlugCounts.has(slug)) {
      problems.push(`eventsAtAGlance.rows is missing a row for event slug '${slug}'`);
    }
  });

  /* --- weeklyProgram ---------------------------------------------------
     getRunningOrder() reads `codes[code]` without guarding, and renders a
     block's name/rule from the event that code's `slug` points at. A typo in
     either — a slot naming a code that isn't in `codes`, or a code pointing
     at an event slug that no longer exists — must blow up here, at load, in
     one obvious message, rather than at whichever coach happens to pick that
     program on the night. */
  const slotSet = new Set(weeklyProgram.slotOrder);
  const ageIds = new Set();

  weeklyProgram.ageGroups.forEach((age, i) => {
    if (!age.id || !age.name) {
      problems.push(`weeklyProgram.ageGroups[${i}] needs both an id and a name`);
    }
    if (ageIds.has(age.id)) {
      problems.push(`weeklyProgram.ageGroups has duplicate id '${age.id}'`);
    }
    ageIds.add(age.id);
  });

  if (!ageIds.has(weeklyProgram.defaultAgeId)) {
    problems.push(
      `weeklyProgram.defaultAgeId '${weeklyProgram.defaultAgeId}' is not an ageGroups id`
    );
  }

  Object.keys(weeklyProgram.codes).forEach((code) => {
    const entry = weeklyProgram.codes[code];
    const where = `weeklyProgram.codes['${code}']`;
    if (!entry.detail) {
      problems.push(`${where} is missing a detail string`);
    }
    if (entry.slug == null) {
      // No page in this guide — it must carry its own display name instead.
      if (!entry.name) {
        problems.push(`${where} has slug null so it must carry its own name`);
      }
    } else if (!knownSlugs.has(entry.slug)) {
      problems.push(`${where} references unknown event slug '${entry.slug}'`);
    }
    (entry.also || []).forEach((slug) => {
      if (!knownSlugs.has(slug)) {
        problems.push(`${where}.also references unknown event slug '${slug}'`);
      }
    });
  });

  const programIds = new Set();
  weeklyProgram.programs.forEach((program, i) => {
    const where = `weeklyProgram.programs[${i}]`;
    if (!program.id || !program.name) {
      problems.push(`${where} needs both an id and a name`);
    }
    if (programIds.has(program.id)) {
      problems.push(`weeklyProgram.programs has duplicate id '${program.id}'`);
    }
    programIds.add(program.id);

    // slots: null is the deliberate "grid not transcribed yet" state, not an
    // error — see the PROVENANCE note on weeklyProgram.
    if (program.slots == null) return;

    Object.keys(program.slots).forEach((ageId) => {
      const at = `weeklyProgram.programs['${program.id}'].slots['${ageId}']`;
      if (!ageIds.has(ageId)) {
        problems.push(`${at} is not an ageGroups id`);
      }
      const slots = program.slots[ageId];
      if (!Array.isArray(slots) || slots.length === 0) {
        problems.push(`${at} must be a non-empty array of [time, code] pairs`);
        return;
      }
      let previousIndex = -1;
      slots.forEach(([time, code, marker], j) => {
        if (!slotSet.has(time)) {
          problems.push(`${at}[${j}] has time '${time}', which is not in slotOrder`);
        } else {
          const index = weeklyProgram.slotOrder.indexOf(time);
          if (index <= previousIndex) {
            problems.push(`${at}[${j}] time '${time}' is out of order or repeated`);
          }
          previousIndex = index;
        }
        if (!weeklyProgram.codes[code]) {
          problems.push(`${at}[${j}] uses code '${code}', which is not in weeklyProgram.codes`);
        }
        if (marker !== undefined && marker !== 'pack-up') {
          problems.push(`${at}[${j}] has unknown marker '${marker}' (only 'pack-up')`);
        }
      });
    });
  });

  if (problems.length) {
    throw new Error(
      'content.js: broken Tonight-mode linkage —\n' + problems.join('\n')
    );
  }
})();

/** Look up an event by its route slug. Returns undefined if unknown. */
export function getEvent(slug) {
  return events.find((e) => e.slug === slug);
}

/**
 * Look up a game item by its route slug, along with the category it lives
 * in (js/views/gameDetail.js needs the category's `name` for the page's
 * kicker/chip). Returns null if unknown, rather than throwing, so a bad
 * deep link falls through to the Not Found view the same way an unknown
 * event slug does (see router.js).
 */
export function getGameItem(slug) {
  for (const category of games.categories) {
    const item = (category.items || []).find((i) => i.slug === slug);
    if (item) return { item, category };
  }
  return null;
}

/** Look up a resource by key. Throws loudly in dev if the key is a typo. */
export function getResource(key) {
  const r = resources[key];
  if (!r) throw new Error('Unknown resource key: ' + key);
  return r;
}
