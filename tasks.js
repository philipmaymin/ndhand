/**
 * Nondominant Hand Study – jsPsych Task Definitions
 * All task-building functions for T1, T2, and Daily sessions.
 * Each function takes a jsPsych instance and returns an array of timeline nodes.
 */

var TASKS = {};

/* =========================================================
   PROLIFIC / ID UTILITIES
   ========================================================= */

TASKS.getProlificParams = function () {
  var urlParams = new URLSearchParams(window.location.search);
  return {
    prolific_pid: urlParams.get("PROLIFIC_PID") || "",
    study_id: urlParams.get("STUDY_ID") || "",
    session_id: urlParams.get("SESSION_ID") || "",
    group: urlParams.get("GROUP") || "",
    day: urlParams.get("DAY") || "",
    session: urlParams.get("SESSION") || ""
  };
};

TASKS.prolificComplete = function (jsPsych) {
  var params = TASKS.getProlificParams();
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var completionCode = jsPsych.randomization.randomID(8).toUpperCase();
      // Save completion code to data
      jsPsych.data.addProperties({ completion_code: completionCode });
      return "<h2>Thank you!</h2>" +
        "<p>Your completion code is: <strong>" + completionCode + "</strong></p>" +
        "<p>Please copy this code and return to Prolific to paste it.</p>" +
        "<p>If you are automatically redirected, you do not need to copy the code.</p>";
    },
    choices: ["Finish"],
    on_finish: function () {
      // Attempt Prolific redirect
      var pid = params.prolific_pid;
      if (pid) {
        window.location.href =
          "https://app.prolific.com/submissions/complete?cc=COMPLETIONCODE";
      }
    }
  };
};

/* =========================================================
   WELCOME + ID CAPTURE
   ========================================================= */

TASKS.welcome = function (jsPsych, sessionLabel) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h1>Correlates of Handedness Study</h1>" +
      "<p>" + sessionLabel + "</p>" +
      "<p>Thank you for participating. Please complete this session in a quiet environment " +
      "on a laptop or desktop computer.</p>" +
      "<p>The session will take approximately " +
      (sessionLabel.indexOf("Daily") >= 0 ? "10–15" : "35–45") +
      " minutes.</p>",
    choices: ["Begin"]
  };
};

/* =========================================================
   CONSENT
   ========================================================= */

TASKS.consent = function (jsPsych) {
  return {
    type: jsPsychSurveyMultiChoice,
    preamble:
      "<h2>Informed Consent</h2>" +
      "<div style='text-align:left; max-width:700px; margin:auto; font-size:14px; max-height:400px; overflow-y:scroll; border:1px solid #ccc; padding:15px; margin-bottom:20px;'>" +
      "<p><strong>Study Title:</strong> Correlates of Non-Dominant Hand Use</p>" +
      "<p><strong>Researchers:</strong> Ellen Langer &amp; Deborah Phillips, Harvard University</p>" +
      "<h3>Key Information</h3>" +
      "<p><strong>Why am I being invited to take part?</strong> We invite you to take part because " +
      "we are studying correlates of handedness in right-handed people.</p>" +
      "<p><strong>What should I know about a research study?</strong></p>" +
      "<ul>" +
      "<li>Whether or not you take part is up to you.</li>" +
      "<li>Your participation is completely voluntary.</li>" +
      "<li>You can agree to take part and later change your mind.</li>" +
      "<li>Your decision will not be held against you.</li>" +
      "<li>You can ask all the questions you want before you decide.</li>" +
      "</ul>" +
      "<p><strong>Why is this research being done?</strong> The purpose of this research is to examine " +
      "if increased or maintained hand use increases visual and spatial abilities.</p>" +
      "<h3>How long will the research last and what will I need to do?</h3>" +
      "<p>This research takes place over one week, entirely online. There will be two online assessment sessions " +
      "of approximately 35–45 minutes each, and 6 days of daily activities of approximately 10–15 minutes per day.</p>" +
      "<p><strong>Session 1</strong> (today): You will complete questions about your demographics, musical background, " +
      "hand preference, and level of mindfulness, as well as tasks related to visual attention, memory, and creativity. " +
      "You may skip any questions you do not want to answer. You will then be given instructions for a daily activity " +
      "involving your hands over the next week.</p>" +
      "<p><strong>Days 1–6:</strong> You will complete approximately 10 minutes of typing per day while following " +
      "your assigned instructions, plus a brief daily survey.</p>" +
      "<p><strong>Session 2</strong> (after ~1 week): You will complete the same assessments as Session 1, " +
      "without demographic questions, plus a few questions about your experience.</p>" +
      "<h3>Risks and Benefits</h3>" +
      "<p>We don't believe there are any risks from participating in this research beyond those of everyday computer use. " +
      "You may withdraw at any time without penalty.</p>" +
      "<p>We cannot promise any benefits to you or others from your taking part in this research. However, " +
      "increased attention may benefit individuals who were previously unaware of hand use.</p>" +
      "<h3>Compensation</h3>" +
      "<p>You will be compensated via Prolific upon completion of each study part.</p>" +
      "<h3>Confidentiality</h3>" +
      "<p>Your data will be stored securely and identified only by your Prolific ID. " +
      "No personally identifying information will be collected. Data will be kept in password-protected files.</p>" +
      "<h3>Contact</h3>" +
      "<p>Questions should be directed to the research team via Prolific messaging, or to " +
      "Dr. Deborah Phillips (dphillips@fas.harvard.edu).</p>" +
      "</div>",
    questions: [
      {
        prompt: "Do you consent to participate in this study?",
        name: "consent",
        options: ["I consent to participate", "I do NOT consent"],
        required: true
      }
    ],
    on_finish: function (data) {
      if (data.response.consent === "I do NOT consent") {
        jsPsych.endExperiment(
          "<p>Thank you for your time. You have chosen not to participate. " +
          "You may close this window.</p>"
        );
      }
    }
  };
};

/* =========================================================
   DEMOGRAPHICS
   ========================================================= */

TASKS.demographics = function (jsPsych) {
  return [
    {
      type: jsPsychSurveyHtmlForm,
      preamble: "<h2>Demographics</h2>",
      html:
        '<div style="text-align:left; max-width:600px; margin:auto;">' +
        '<p><label>Age: <input name="age" type="number" min="18" max="120" required></label></p>' +
        "<p>Sex assigned at birth:<br>" +
        '<label><input type="radio" name="sex" value="male" required> Male</label><br>' +
        '<label><input type="radio" name="sex" value="female"> Female</label><br>' +
        '<label><input type="radio" name="sex" value="other"> Other / Prefer not to say</label></p>' +
        "<p>Race/Ethnicity (select all that apply):<br>" +
        '<label><input type="checkbox" name="race_white" value="1"> White</label><br>' +
        '<label><input type="checkbox" name="race_black" value="1"> Black or African American</label><br>' +
        '<label><input type="checkbox" name="race_asian" value="1"> Asian</label><br>' +
        '<label><input type="checkbox" name="race_hispanic" value="1"> Hispanic or Latino</label><br>' +
        '<label><input type="checkbox" name="race_native" value="1"> American Indian or Alaska Native</label><br>' +
        '<label><input type="checkbox" name="race_pacific" value="1"> Native Hawaiian or Pacific Islander</label><br>' +
        '<label><input type="checkbox" name="race_other" value="1"> Other</label></p>' +
        "<p>Highest education level completed:<br>" +
        '<select name="education" required>' +
        '<option value="">-- Select --</option>' +
        '<option value="high_school">High school / GED</option>' +
        '<option value="some_college">Some college</option>' +
        '<option value="associates">Associate degree</option>' +
        '<option value="bachelors">Bachelor\'s degree</option>' +
        '<option value="masters">Master\'s degree</option>' +
        '<option value="doctorate">Doctoral degree</option>' +
        '<option value="other">Other</option>' +
        "</select></p>" +
        "<p>Please confirm: Are you right-handed?<br>" +
        '<label><input type="radio" name="right_handed" value="yes" required> Yes</label><br>' +
        '<label><input type="radio" name="right_handed" value="no"> No</label></p>' +
        "</div>",
      on_finish: function (data) {
        if (data.response.right_handed === "no") {
          jsPsych.endExperiment(
            "<p>Thank you, but this study is only for right-handed individuals. " +
            "You may close this window and return your Prolific submission.</p>"
          );
        }
      }
    },
    {
      type: jsPsychSurveyHtmlForm,
      preamble: "<h2>Musical & Hand-Use Background</h2>",
      html:
        '<div style="text-align:left; max-width:600px; margin:auto;">' +
        "<p>Do you play a musical instrument?<br>" +
        '<label><input type="radio" name="plays_instrument" value="yes" required> Yes</label><br>' +
        '<label><input type="radio" name="plays_instrument" value="no"> No</label></p>' +
        '<p><label>If yes, which instrument(s)? <input name="instruments" type="text" style="width:100%"></label></p>' +
        '<p><label>If yes, how many years have you played? <input name="years_playing" type="number" min="0" max="80"></label></p>' +
        '<p><label>How many hours per week do you currently practice? <input name="practice_hours" type="number" min="0" max="100"></label></p>' +
        "<p>Do you regularly play video games?<br>" +
        '<label><input type="radio" name="plays_videogames" value="yes" required> Yes</label><br>' +
        '<label><input type="radio" name="plays_videogames" value="no"> No</label></p>' +
        '<p><label>If yes, approximately how many hours per week? <input name="videogame_hours" type="number" min="0" max="100"></label></p>' +
        "<p>Are there any other regular activities where you use your non-dominant (left) hand? " +
        "If so, please describe:<br>" +
        '<textarea name="other_left_hand_activities" rows="3" style="width:100%"></textarea></p>' +
        "</div>"
    }
  ];
};

/* =========================================================
   EDINBURGH HANDEDNESS INVENTORY (Oldfield, 1971)
   ========================================================= */

TASKS.edinburgh = function (jsPsych) {
  var activities = [
    "Writing",
    "Drawing",
    "Throwing",
    "Using scissors",
    "Using a toothbrush",
    "Using a knife (without fork)",
    "Using a spoon",
    "Using a broom (upper hand)",
    "Striking a match",
    "Opening a box (lid)"
  ];

  var questions = activities.map(function (act) {
    return {
      prompt: act,
      name: "edinburgh_" + act.toLowerCase().replace(/[^a-z]/g, "_"),
      options: [
        "Always left",
        "Usually left",
        "No preference",
        "Usually right",
        "Always right"
      ],
      required: true
    };
  });

  return {
    type: jsPsychSurveyMultiChoice,
    preamble:
      "<h2>Edinburgh Handedness Inventory</h2>" +
      "<p>For each activity, indicate which hand you prefer to use.</p>" +
      "<p>'Always' means you would never use the other hand unless forced to.</p>",
    questions: questions,
    data: { task: "edinburgh" }
  };
};

/* =========================================================
   LANGER MINDFULNESS SCALE (LMS-14, Pirson et al., 2012)
   ========================================================= */

TASKS.mindfulness = function (jsPsych) {
  var items = [
    "I like to investigate things.",
    "I generate few novel ideas.",
    "I am always open to new ways of doing things.",
    'I "get involved" in almost everything I do.',
    "I am not an original thinker.",
    "I am very creative.",
    "I seldom notice what other people are up to.",
    "I avoid thought-provoking conversations.",
    "I am very curious.",
    "I try to think of new ways of doing things.",
    "I am rarely aware of changes.",
    "I have an open mind about everything, even things that challenge my core beliefs.",
    "I like to be challenged intellectually.",
    "I find it easy to create new and effective ideas."
  ];

  var labels = [
    "Strongly Disagree",
    "Disagree",
    "Slightly Disagree",
    "Neutral",
    "Slightly Agree",
    "Agree",
    "Strongly Agree"
  ];

  var questions = items.map(function (item, i) {
    return {
      prompt: item,
      name: "lms_" + (i + 1),
      labels: labels,
      required: true
    };
  });

  return {
    type: jsPsychSurveyLikert,
    preamble:
      "<h2>Mindfulness Scale</h2>" +
      "<p>Please rate how much you agree or disagree with each statement.</p>",
    questions: questions,
    data: { task: "mindfulness" }
  };
};

/* =========================================================
   VISUAL SEARCH TASK (T-among-L's)
   Measures visuospatial attention.
   ========================================================= */

TASKS.visualSearch = function (jsPsych) {
  var timeline = [];

  // Instructions
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h2>Visual Attention Task</h2>" +
      "<p>In this task, you will see a display of letters. " +
      "Your job is to determine whether the letter <strong>T</strong> is present among the other letters.</p>" +
      "<p>The letters will be rotated in different directions.</p>" +
      '<p>Press <strong>F</strong> if the T is <strong>present</strong>.</p>' +
      '<p>Press <strong>J</strong> if the T is <strong>absent</strong>.</p>' +
      "<p>Please respond as quickly and accurately as possible.</p>" +
      "<p>We will start with a few practice trials.</p>",
    choices: ["Start Practice"]
  });

  // Helper: draw a rotated letter on canvas
  function drawLetter(ctx, letter, x, y, rotation, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    var half = size / 2;
    if (letter === "T") {
      // Horizontal top bar
      ctx.moveTo(-half, -half);
      ctx.lineTo(half, -half);
      // Vertical stem
      ctx.moveTo(0, -half);
      ctx.lineTo(0, half);
    } else {
      // L shape: vertical bar + horizontal bottom bar
      ctx.moveTo(-half, -half);
      ctx.lineTo(-half, half);
      ctx.moveTo(-half, half);
      ctx.lineTo(half, half);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Generate non-overlapping positions
  function generatePositions(n, canvasW, canvasH, stimSize, margin) {
    var positions = [];
    var minDist = stimSize + margin;
    var attempts = 0;
    while (positions.length < n && attempts < 5000) {
      var x = stimSize + Math.random() * (canvasW - 2 * stimSize);
      var y = stimSize + Math.random() * (canvasH - 2 * stimSize);
      // Check distance from center (avoid fixation area)
      var dxC = x - canvasW / 2;
      var dyC = y - canvasH / 2;
      if (Math.sqrt(dxC * dxC + dyC * dyC) < stimSize * 1.5) {
        attempts++;
        continue;
      }
      var tooClose = false;
      for (var i = 0; i < positions.length; i++) {
        var dx = x - positions[i][0];
        var dy = y - positions[i][1];
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        positions.push([x, y]);
      }
      attempts++;
    }
    return positions;
  }

  var rotations = [0, 90, 180, 270];
  var setSizes = [8, 16, 24];
  var stimSize = 28;
  var canvasW = 800;
  var canvasH = 600;

  // Build trial list
  var trialDefs = [];
  setSizes.forEach(function (ss) {
    for (var rep = 0; rep < 8; rep++) {
      trialDefs.push({ setSize: ss, targetPresent: true });
      trialDefs.push({ setSize: ss, targetPresent: false });
    }
  });
  // 48 test trials total

  // Practice trials
  var practiceDefs = [];
  setSizes.forEach(function (ss) {
    practiceDefs.push({ setSize: ss, targetPresent: true });
    practiceDefs.push({ setSize: ss, targetPresent: false });
  });
  // 6 practice trials

  function buildTrials(defs, isPractice) {
    var shuffled = jsPsych.randomization.shuffle(defs);
    var trialNodes = [];

    shuffled.forEach(function (def, idx) {
      // Fixation
      trialNodes.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:48px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 500
      });

      // Search display
      trialNodes.push({
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [canvasH, canvasW],
        stimulus: function (canvas) {
          var ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvasW, canvasH);

          ctx.fillStyle = "#999";
          ctx.beginPath();
          ctx.arc(canvasW / 2, canvasH / 2, 3, 0, 2 * Math.PI);
          ctx.fill();

          var positions = generatePositions(
            def.setSize,
            canvasW,
            canvasH,
            stimSize,
            10
          );

          for (var i = 0; i < positions.length; i++) {
            var letter = i === 0 && def.targetPresent ? "T" : "L";
            var rot = rotations[Math.floor(Math.random() * rotations.length)];
            drawLetter(
              ctx,
              letter,
              positions[i][0],
              positions[i][1],
              rot,
              stimSize
            );
          }
        },
        choices: ["f", "j"],
        prompt:
          '<p style="font-size:14px; color:#666;">F = T present &nbsp;&nbsp; J = T absent</p>',
        data: {
          task: "visual_search",
          practice: isPractice,
          target_present: def.targetPresent,
          set_size: def.setSize
        },
        on_finish: function (data) {
          data.correct = def.targetPresent
            ? data.response === "f"
            : data.response === "j";
        }
      });

      // Feedback (practice only)
      if (isPractice) {
        trialNodes.push({
          type: jsPsychHtmlKeyboardResponse,
          stimulus: function () {
            var last = jsPsych.data.getLastTrialData().values()[0];
            return last.correct
              ? '<p style="font-size:36px; color:green;">Correct!</p>'
              : '<p style="font-size:36px; color:red;">Incorrect</p>';
          },
          choices: "NO_KEYS",
          trial_duration: 800
        });
      }
    });

    return trialNodes;
  }

  // Practice
  var practiceTrials = buildTrials(practiceDefs, true);
  timeline = timeline.concat(practiceTrials);

  // Transition to test
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<p>Practice complete. Now the real trials will begin.</p>" +
      "<p>Remember: <strong>F</strong> = T present, <strong>J</strong> = T absent.</p>" +
      "<p>Respond as quickly and accurately as you can.</p>",
    choices: ["Start"]
  });

  // Test trials
  var testTrials = buildTrials(trialDefs, false);
  timeline = timeline.concat(testTrials);

  // Summary
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var data = jsPsych.data
        .get()
        .filter({ task: "visual_search", practice: false });
      var acc = Math.round(
        (data.filter({ correct: true }).count() / data.count()) * 100
      );
      return (
        "<p>Visual attention task complete.</p>" +
        "<p>Your accuracy: " + acc + "%</p>"
      );
    },
    choices: ["Continue"]
  });

  return timeline;
};

/* =========================================================
   DIGIT SPAN (MESA V / WAIS-III)
   Forward and Backward
   ========================================================= */

TASKS.digitSpan = function (jsPsych) {
  var timeline = [];

  // Digit sequences from MESA V Digit Span Test
  var forwardItems = [
    { span: 2, a: [1, 7], b: [6, 3] },
    { span: 3, a: [5, 8, 2], b: [6, 9, 4] },
    { span: 4, a: [6, 4, 3, 9], b: [7, 2, 8, 6] },
    { span: 5, a: [4, 2, 7, 3, 1], b: [7, 5, 8, 3, 6] },
    { span: 6, a: [6, 1, 9, 4, 7, 3], b: [3, 9, 2, 4, 8, 7] },
    { span: 7, a: [5, 9, 1, 7, 4, 2, 8], b: [4, 1, 7, 9, 3, 8, 6] },
    { span: 8, a: [5, 8, 1, 9, 2, 6, 4, 7], b: [3, 8, 2, 9, 5, 1, 7, 4] },
    { span: 9, a: [2, 7, 5, 8, 6, 2, 5, 8, 4], b: [7, 1, 3, 9, 4, 2, 5, 6, 8] }
  ];

  var backwardItems = [
    { span: 2, a: [2, 4], b: [5, 7] },
    { span: 3, a: [6, 2, 9], b: [4, 1, 5] },
    { span: 4, a: [3, 2, 7, 9], b: [4, 9, 6, 8] },
    { span: 5, a: [1, 5, 2, 8, 6], b: [6, 1, 8, 4, 3] },
    { span: 6, a: [5, 3, 9, 4, 1, 8], b: [7, 2, 4, 8, 5, 6] },
    { span: 7, a: [8, 1, 2, 9, 3, 6, 5], b: [4, 7, 3, 9, 1, 2, 8] },
    { span: 8, a: [9, 4, 3, 7, 6, 2, 5, 8], b: [7, 2, 8, 1, 9, 6, 5, 3] }
  ];

  // Instructions for Forward
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h2>Digit Span Task</h2>" +
      "<p>You will see a sequence of numbers, one at a time.</p>" +
      "<p><strong>Part 1 – Forward:</strong> After the sequence ends, " +
      "type the numbers in the <strong>same order</strong> they appeared.</p>" +
      "<p>For example, if you see: 7, then 1, then 9 — type <strong>719</strong></p>" +
      "<p>The sequences will get longer as you go. We will stop when it gets too difficult.</p>",
    choices: ["Start"]
  });

  function buildDigitSpanBlock(items, direction) {
    var blockTimeline = [];
    // We need to track discontinued state across items.
    // Use a conditional function to skip trials after discontinuation.

    var discontinued = { value: false };
    var scores = { forward: [], backward: [] };

    items.forEach(function (item, itemIdx) {
      ["a", "b"].forEach(function (trial) {
        var digits = item[trial];
        var correctAnswer =
          direction === "forward"
            ? digits.join("")
            : digits.slice().reverse().join("");

        // Check if discontinued
        blockTimeline.push({
          type: jsPsychCallFunction,
          func: function () {
            // Will be checked by conditional
          },
          data: {
            task: "digit_span_check",
            _ds_discontinued: false
          },
          on_finish: function (data) {
            data._ds_discontinued = discontinued.value;
          }
        });

        // Show each digit one at a time
        digits.forEach(function (digit, digitIdx) {
          blockTimeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus:
              '<div style="font-size:72px; font-weight:bold;">' +
              digit +
              "</div>",
            choices: "NO_KEYS",
            trial_duration: 1000,
            conditional_function: function () {
              return !discontinued.value;
            }
          });

          // Brief blank between digits
          if (digitIdx < digits.length - 1) {
            blockTimeline.push({
              type: jsPsychHtmlKeyboardResponse,
              stimulus: "",
              choices: "NO_KEYS",
              trial_duration: 250,
              conditional_function: function () {
                return !discontinued.value;
              }
            });
          }
        });

        // Pause before response
        blockTimeline.push({
          type: jsPsychHtmlKeyboardResponse,
          stimulus: '<div style="font-size:36px; color:#999;">?</div>',
          choices: "NO_KEYS",
          trial_duration: 500,
          conditional_function: function () {
            return !discontinued.value;
          }
        });

        // Response
        blockTimeline.push({
          type: jsPsychSurveyText,
          questions: [
            {
              prompt:
                "Type the digits " +
                (direction === "forward" ? "in order" : "in REVERSE order") +
                ":",
              name: "response",
              required: true
            }
          ],
          data: {
            task: "digit_span",
            direction: direction,
            span_length: item.span,
            trial: trial,
            item_index: itemIdx,
            correct_answer: correctAnswer,
            digits_shown: digits.join("")
          },
          conditional_function: function () {
            return !discontinued.value;
          },
          on_finish: function (data) {
            var resp = data.response.response.replace(/\s/g, "");
            data.correct = resp === correctAnswer;

            // Track scores for discontinuation logic
            var key = direction;
            if (!scores[key][itemIdx]) {
              scores[key][itemIdx] = { a: null, b: null };
            }
            scores[key][itemIdx][trial] = data.correct;

            // Check discontinuation: both trials at same span failed
            if (
              trial === "b" &&
              scores[key][itemIdx] &&
              scores[key][itemIdx].a === false &&
              scores[key][itemIdx].b === false
            ) {
              discontinued.value = true;
            }
          }
        });
      });
    });

    return blockTimeline;
  }

  // Forward block
  timeline = timeline.concat(buildDigitSpanBlock(forwardItems, "forward"));

  // Instructions for Backward
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h2>Digit Span – Part 2</h2>" +
      "<p><strong>Backward:</strong> This time, type the numbers in <strong>reverse order</strong>.</p>" +
      "<p>For example, if you see: 7, then 1, then 9 — type <strong>917</strong></p>",
    choices: ["Start"],
    on_start: function () {
      // Reset discontinued state for backward block
    }
  });

  // Backward block
  timeline = timeline.concat(buildDigitSpanBlock(backwardItems, "backward"));

  // Summary
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var fwd = jsPsych.data
        .get()
        .filter({ task: "digit_span", direction: "forward" });
      var bwd = jsPsych.data
        .get()
        .filter({ task: "digit_span", direction: "backward" });
      var fwdCorrect = fwd.filter({ correct: true }).count();
      var bwdCorrect = bwd.filter({ correct: true }).count();
      return (
        "<p>Digit span task complete.</p>" +
        "<p>Forward: " + fwdCorrect + " correct | " +
        "Backward: " + bwdCorrect + " correct</p>"
      );
    },
    choices: ["Continue"]
  });

  return timeline;
};

/* =========================================================
   REMOTE ASSOCIATES TASK (RAT)
   30 items, 10-minute time limit, auto-scored.

   *** IMPORTANT: Verify answer key before running! ***
   Some answers may need correction. Answers marked (?) are
   best guesses that should be checked against the original
   answer key or Bowden & Jung-Beeman (2003) norms.
   ========================================================= */

TASKS.rat = function (jsPsych) {
  var timeline = [];

  // Item 8 is missing from original materials (numbering skips 7→9).
  var items = [
    { id: 1, words: ["call", "pay", "line"], answer: "phone" },
    { id: 2, words: ["end", "burning", "blue"], answer: "book" },
    { id: 3, words: ["man", "hot", "sure"], answer: "fire" },
    { id: 4, words: ["stick", "pal", "ball"], answer: "pen" },
    { id: 5, words: ["blue", "cake", "cottage"], answer: "cheese" },
    { id: 6, words: ["man", "wheel", "high"], answer: "chair" },
    { id: 7, words: ["motion", "poke", "down"], answer: "slow" },
    { id: 9, words: ["line", "birthday", "surprise"], answer: "party" },
    { id: 10, words: ["wood", "liquor", "luck"], answer: "hard" },
    { id: 11, words: ["house", "village", "golf"], answer: "green" },
    { id: 12, words: ["plan", "show", "walker"], answer: "floor" },
    { id: 13, words: ["key", "wall", "previous"], answer: "stone" },
    { id: 14, words: ["bell", "iron", "tender"], answer: "bar" },
    { id: 15, words: ["water", "youth", "soda"], answer: "fountain" },
    { id: 16, words: ["base", "snow", "dance"], answer: "ball" },
    { id: 17, words: ["stop", "kart", "slow"], answer: "go" },
    { id: 18, words: ["up", "book", "charge"], answer: "cover" },
    { id: 19, words: ["tin", "writer", "my"], answer: "type" },
    { id: 20, words: ["leg", "arm", "person"], answer: "chair" },
    { id: 21, words: ["weight", "out", "pencil"], answer: "lead" },
    { id: 22, words: ["spin", "tip", "shape"], answer: "top" },
    { id: 23, words: ["sharp", "tick", "tie"], answer: "tack" },
    { id: 24, words: ["out", "band", "night"], answer: "stand" },
    { id: 25, words: ["cool", "house", "fat"], answer: "cat" },
    { id: 26, words: ["back", "go", "light"], answer: "green" },
    { id: 27, words: ["man", "order", "air"], answer: "mail" },
    { id: 28, words: ["bath", "up", "burst"], answer: "bubble" },
    { id: 29, words: ["ball", "out", "blue"], answer: "black" },
    { id: 30, words: ["up", "around", "rear"], answer: "end" }
  ];

  // Instructions
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h2>Word Association Task</h2>" +
      "<p>You will see three words. Your job is to find a <strong>fourth word</strong> " +
      "that is related to all three.</p>" +
      "<p><strong>Example:</strong> paint &nbsp; doll &nbsp; cat</p>" +
      '<p>Answer: <strong>house</strong> (house paint, dollhouse, house cat)</p>' +
      "<p><strong>Example:</strong> stool &nbsp; powder &nbsp; ball</p>" +
      '<p>Answer: <strong>foot</strong> (footstool, foot powder, football)</p>' +
      "<p>You have <strong>10 minutes</strong> total for up to 29 items. " +
      "If you can't think of an answer, you may skip it, but you cannot go back.</p>",
    choices: ["Start"]
  });

  // Track time
  var ratStartTime = null;
  var RAT_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in ms

  timeline.push({
    type: jsPsychCallFunction,
    func: function () {
      ratStartTime = Date.now();
    }
  });

  // Individual RAT items
  items.forEach(function (item) {
    timeline.push({
      type: jsPsychSurveyText,
      preamble:
        '<div style="font-size:14px; color:#999;" id="rat-timer"></div>' +
        '<p style="font-size:28px; font-weight:bold; letter-spacing:20px;">' +
        item.words[0].toUpperCase() +
        " &nbsp;&nbsp; " +
        item.words[1].toUpperCase() +
        " &nbsp;&nbsp; " +
        item.words[2].toUpperCase() +
        "</p>",
      questions: [
        {
          prompt: "What word is related to all three?",
          name: "answer",
          required: false,
          placeholder: "Type your answer or leave blank to skip"
        }
      ],
      button_label: "Submit",
      data: {
        task: "rat",
        item_id: item.id,
        words: item.words.join(", "),
        correct_answer: item.answer
      },
      conditional_function: function () {
        if (ratStartTime === null) return true;
        return Date.now() - ratStartTime < RAT_TIME_LIMIT;
      },
      on_load: function () {
        // Update timer display
        var timerEl = document.getElementById("rat-timer");
        if (timerEl && ratStartTime) {
          var updateTimer = setInterval(function () {
            var elapsed = Date.now() - ratStartTime;
            var remaining = Math.max(0, RAT_TIME_LIMIT - elapsed);
            var mins = Math.floor(remaining / 60000);
            var secs = Math.floor((remaining % 60000) / 1000);
            if (timerEl) {
              timerEl.textContent =
                "Time remaining: " +
                mins + ":" + (secs < 10 ? "0" : "") + secs;
            }
            if (remaining <= 0) {
              clearInterval(updateTimer);
              // Auto-advance when time is up
              var btn = document.querySelector(
                "#jspsych-survey-text-next"
              );
              if (btn) btn.click();
            }
          }, 1000);
        }
      },
      on_finish: function (data) {
        var resp = (data.response.answer || "").trim().toLowerCase();
        var correct = resp === item.answer.toLowerCase();
        // Also accept 1-edit-distance matches for typo tolerance
        if (!correct && resp.length > 0) {
          correct = levenshtein(resp, item.answer.toLowerCase()) <= 1;
        }
        data.participant_answer = resp;
        data.correct = correct;
        data.time_elapsed = Date.now() - ratStartTime;
      }
    });
  });

  // Summary
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var ratData = jsPsych.data.get().filter({ task: "rat" });
      var correct = ratData.filter({ correct: true }).count();
      var attempted = ratData.count();
      return (
        "<p>Word association task complete.</p>" +
        "<p>You answered " + correct + " out of " + attempted + " correctly.</p>"
      );
    },
    choices: ["Continue"]
  });

  return timeline;
};

// Levenshtein distance helper
function levenshtein(a, b) {
  var matrix = [];
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/* =========================================================
   GROUP ASSIGNMENT (T1 only)
   ========================================================= */

TASKS.groupAssignment = function (jsPsych) {
  var timeline = [];

  /*
   * 5 conditions (2x2 factorial + no-instruction control):
   *   Group 1: Awareness of LEFT hand (non-dominant), no behavior change
   *   Group 2: Awareness + Increased use of LEFT hand (non-dominant)
   *   Group 3: Awareness of RIGHT hand (dominant), no behavior change
   *   Group 4: Awareness + Increased use of RIGHT hand (dominant)
   *   Group 5: No instruction (pure control, just type normally)
   */

  var groupInstructions = {
    1: {
      title: "Your Daily Activity Instructions",
      text:
        "<p>For the next 6 days, you will complete a brief daily typing and writing activity.</p>" +
        "<h3>Your instructions:</h3>" +
        "<p>While typing, <strong>be more aware of how you use your LEFT hand</strong>. " +
        "Pay attention to how your left hand moves around the keyboard.</p>" +
        "<p><strong>Do NOT change which hand you use</strong> for any keys. " +
        "Just pay attention to your left hand while typing as you normally would.</p>" +
        "<p>Throughout the day, also try to notice when and how you use your left hand " +
        "in everyday activities.</p>"
    },
    2: {
      title: "Your Daily Activity Instructions",
      text:
        "<p>For the next 6 days, you will complete a brief daily typing and writing activity.</p>" +
        "<h3>Your instructions:</h3>" +
        "<p>While typing, <strong>be more aware of how you use your LEFT hand AND " +
        "try to increase your use of your left hand</strong>.</p>" +
        "<p>For example, try pressing the spacebar with your left thumb, or " +
        "use your left hand for keys you might normally reach for with your right.</p>" +
        "<p>Also try to increase left-hand use in your daily activities " +
        "(e.g., opening doors, picking up objects, stirring, brushing teeth).</p>"
    },
    3: {
      title: "Your Daily Activity Instructions",
      text:
        "<p>For the next 6 days, you will complete a brief daily typing and writing activity.</p>" +
        "<h3>Your instructions:</h3>" +
        "<p>While typing, <strong>be more aware of how you use your RIGHT hand</strong>. " +
        "Pay attention to how your right hand moves around the keyboard.</p>" +
        "<p><strong>Do NOT change which hand you use</strong> for any keys. " +
        "Just pay attention to your right hand while typing as you normally would.</p>" +
        "<p>Throughout the day, also try to notice when and how you use your right hand " +
        "in everyday activities.</p>"
    },
    4: {
      title: "Your Daily Activity Instructions",
      text:
        "<p>For the next 6 days, you will complete a brief daily typing and writing activity.</p>" +
        "<h3>Your instructions:</h3>" +
        "<p>While typing, <strong>be more aware of how you use your RIGHT hand AND " +
        "try to increase your use of your right hand</strong>.</p>" +
        "<p>For example, try pressing the spacebar with your right thumb, or " +
        "use your right hand for keys you might normally reach for with your left.</p>" +
        "<p>Also try to increase right-hand use in your daily activities " +
        "(e.g., opening doors, picking up objects, stirring, brushing teeth).</p>"
    },
    5: {
      title: "Your Daily Activity Instructions",
      text:
        "<p>For the next 6 days, you will complete a brief daily typing and writing activity.</p>" +
        "<h3>Your instructions:</h3>" +
        "<p>Each day you will type a short passage and respond to a brief writing prompt. " +
        "Just type as you normally would.</p>"
    }
  };

  // Assign group
  var assignedGroup = null;

  timeline.push({
    type: jsPsychCallFunction,
    func: function () {
      assignedGroup = jsPsych.randomization.sampleWithoutReplacement(
        [1, 2, 3, 4, 5],
        1
      )[0];
      jsPsych.data.addProperties({ assigned_group: assignedGroup });
    }
  });

  // Show group instructions
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var g = groupInstructions[assignedGroup];
      return (
        "<h2>" + g.title + "</h2>" +
        g.text +
        "<p><strong>Please read these instructions carefully and try to remember them.</strong></p>" +
        '<p style="color:#c00; font-weight:bold;">Your group code is: ' +
        assignedGroup +
        ". Please remember this number.</p>"
      );
    },
    choices: ["I understand"]
  });

  // Confirm understanding (skip for Group 5 since there's no hand instruction)
  timeline.push({
    type: jsPsychSurveyMultiChoice,
    preamble: "<h3>Quick check</h3>",
    questions: [
      {
        prompt: "Which hand should you be more aware of during the daily typing activity?",
        name: "instruction_check",
        options: [
          "Left hand",
          "Right hand",
          "No specific hand — just type normally"
        ],
        required: true
      }
    ],
    data: { task: "instruction_check" },
    on_finish: function (data) {
      var resp = data.response.instruction_check;
      var correct;
      if (assignedGroup === 1 || assignedGroup === 2) {
        correct = resp === "Left hand";
      } else if (assignedGroup === 3 || assignedGroup === 4) {
        correct = resp === "Right hand";
      } else {
        correct = resp === "No specific hand — just type normally";
      }
      data.instruction_check_correct = correct;
    }
  });

  return timeline;
};

/* =========================================================
   DAILY TYPING TASK + DIARY
   ========================================================= */

/* Copy-typing passages (~125 words each) */
TASKS.copyTexts = [
  // Day 1 – nature
  "For all of us, nature is crucial. It is the reason for the existence of life on this planet. Nature is home to many different creatures. All living organisms benefit from the natural balance maintained by the environment. The study of the natural world is a separate discipline of science. Every element has its own story to tell. The beauty of nature is portrayed through the sun and moon, the plants, the flowers, and everything in between. It is a common belief that reacting to something is a natural human characteristic. The resources of nature are plentiful, and their proper use aids in the conservation of the environment.",
  // Day 2 – aviation history
  "December 17, 1903, is the birth date of all airplanes. Orville and Wilbur Wright started building gliders in 1900. In 1903, they built a motor and propeller for their latest glider design. Orville made the first flight, which lasted 12 seconds and covered 120 feet. Wilbur followed with a flight of 852 feet in 59 seconds. These first flights were just the start of the evolution of aircraft. By 1909, Bleriot had crossed the English Channel. By 1912, a two-piece plywood fuselage was built for greater strength. By the 1930s, all-metal fuselages had arrived, and they soon appeared in the legendary DC-3.",
  // Day 3 – Middlemarch (George Eliot)
  "The rural opinion about the new young ladies, even among the cottagers, was generally in favor of Celia, as being so amiable and innocent-looking, while Miss Brooke's large eyes seemed, like her religion, too unusual and striking. Poor Dorothea! Compared with her, the innocent-looking Celia was knowing and worldly-wise; so much subtler is a human mind than the outside tissues which make a sort of blazonry or clock-face for it. Yet those who approached Dorothea, though prejudiced against her by this alarming hearsay, found that she had a charm unaccountably reconcilable with it.",
  // Day 4 – environmental science
  "Natural scavengers include a variety of land and marine animals. Nature has provided us with many ways to sustain ourselves, but with the increasing population, the threats to nature grow as well. Resources are depleting. Excessive levels of air and environmental pollutants add to the strain. Industrial waste, unrestricted vehicle use, illegal deforestation, wildlife hunting, and nuclear power plants are all contributing to the disruption of natural systems. The extinction of species as enormous as dinosaurs has been documented in the fossil record, reminding us that no living thing is guaranteed permanence on Earth.",
  // Day 5 – cooking
  "A good meal begins with a plan. Start by reading the entire recipe through before touching a single ingredient. Gather your tools and measure everything in advance. This approach, known as mise en place, saves time and prevents mistakes. Heat your pan before adding oil, and let the oil shimmer before adding food. Season in layers rather than all at once, tasting as you go. Fresh herbs are best added at the end, while dried herbs need time to release their flavor. Let meat rest after cooking so the juices redistribute. The best cooks are patient observers who pay attention to small details.",
  // Day 6 – architecture
  "Every building tells a story about the people who designed it and the era in which it was built. The ancient Greeks favored symmetry and proportion, using columns to support grand temples. Gothic cathedrals reached toward the sky with pointed arches and flying buttresses that distributed weight in ways no one had tried before. Modern architecture broke with tradition, embracing glass, steel, and open floor plans. Today, sustainable design is reshaping how we think about buildings entirely. Green roofs, passive cooling, and recycled materials are becoming standard features rather than novelties."
];

/* Creative writing prompts (one per day) */
TASKS.creativePrompts = [
  "Describe a place that makes you feel calm. What does it look like, sound like, and feel like?",
  "Write about something you learned recently that surprised you or changed how you think about something.",
  "Describe your morning routine in as much detail as you can. What do you do first, and why?",
  "Write about a skill you wish you had and what you would do with it.",
  "Describe what you see out the nearest window, real or imagined. Include as many details as you can.",
  "Write about something small that made you happy recently. Why did it stand out to you?"
];

TASKS.dailyTask = function (jsPsych, group, dayIndex) {
  var timeline = [];
  var groupNum = parseInt(group) || 5;
  var day = parseInt(dayIndex) || 0;

  var instructions = {
    1: "While typing and writing, <strong>be more aware of how you use your LEFT hand</strong>. " +
       "Pay attention to how your left hand moves around the keyboard. " +
       "Do NOT change which hand you use for any keys.",
    2: "While typing and writing, <strong>be more aware of your LEFT hand AND try to increase " +
       "its use</strong>. Try pressing the spacebar with your left thumb, or use " +
       "your left hand for keys you normally reach for with your right.",
    3: "While typing and writing, <strong>be more aware of how you use your RIGHT hand</strong>. " +
       "Pay attention to how your right hand moves around the keyboard. " +
       "Do NOT change which hand you use for any keys.",
    4: "While typing and writing, <strong>be more aware of your RIGHT hand AND try to increase " +
       "its use</strong>. Try pressing the spacebar with your right thumb, or use " +
       "your right hand for keys you normally reach for with your left.",
    5: "Just type and write as you normally would. There are no special instructions."
  };

  var textIndex = Math.min(day, TASKS.copyTexts.length - 1);
  var copyText = TASKS.copyTexts[textIndex];
  var creativePrompt = TASKS.creativePrompts[textIndex];

  // Reminder of instructions
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus:
      "<h2>Day " + (day + 1) + " — Daily Activity</h2>" +
      "<p><strong>Reminder of your instructions:</strong></p>" +
      "<p>" + instructions[groupNum] + "</p>",
    choices: ["Continue"]
  });

  // Part 1: Copy-typing
  timeline.push({
    type: jsPsychSurveyHtmlForm,
    preamble:
      "<h3>Part 1: Copy Typing</h3>" +
      "<p>Please type the following passage while following your instructions:</p>" +
      '<div style="background:#f5f5f5; padding:15px; border-radius:8px; ' +
      'max-width:700px; margin:auto; line-height:1.6; font-size:15px;">' +
      copyText +
      "</div>",
    html:
      '<div style="max-width:700px; margin:20px auto;">' +
      '<textarea name="typed_text" rows="8" ' +
      'style="width:100%; font-size:15px; padding:10px;" ' +
      'placeholder="Type the passage here..." required></textarea>' +
      "</div>",
    button_label: "Submit",
    data: {
      task: "typing_copy",
      day: day + 1,
      group: groupNum,
      source_text: copyText
    },
    on_finish: function (data) {
      var source = copyText.toLowerCase().replace(/\s+/g, " ").trim();
      var typed = (data.response.typed_text || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      data.word_count = typed.split(" ").length;
      data.source_word_count = source.split(" ").length;
    }
  });

  // Part 2: Creative writing
  timeline.push({
    type: jsPsychSurveyHtmlForm,
    preamble:
      "<h3>Part 2: Free Writing</h3>" +
      "<p>Please write about <strong>125 words</strong> (roughly a paragraph) in response to this prompt, " +
      "while continuing to follow your instructions:</p>" +
      '<div style="background:#f0f7ff; padding:15px; border-radius:8px; ' +
      'max-width:700px; margin:auto; font-size:16px; font-style:italic;">' +
      creativePrompt +
      "</div>",
    html:
      '<div style="max-width:700px; margin:20px auto;">' +
      '<textarea name="creative_text" rows="8" ' +
      'style="width:100%; font-size:15px; padding:10px;" ' +
      'placeholder="Write your response here..." required></textarea>' +
      '<p style="font-size:13px; color:#999;" id="word-counter">Word count: 0</p>' +
      "</div>" +
      '<script>' +
      'document.querySelector("[name=creative_text]").addEventListener("input", function(e) {' +
      '  var words = e.target.value.trim().split(/\\s+/).filter(function(w){return w.length > 0;}).length;' +
      '  document.getElementById("word-counter").textContent = "Word count: " + words;' +
      '});' +
      '<\/script>',
    button_label: "Submit",
    data: {
      task: "typing_creative",
      day: day + 1,
      group: groupNum,
      creative_prompt: creativePrompt
    },
    on_finish: function (data) {
      var text = (data.response.creative_text || "").trim();
      data.word_count = text.split(/\s+/).filter(function (w) {
        return w.length > 0;
      }).length;
    }
  });

  // Daily diary (varies by group)
  var diaryQuestions;
  if (groupNum === 1) {
    diaryQuestions =
      "<p>1. What activities were you aware of your left-hand use in today?</p>" +
      '<textarea name="awareness_activities" rows="3" style="width:100%" required></textarea>' +
      "<p>2. Approximately how many minutes today were you aware of using your left hand?</p>" +
      '<input name="awareness_minutes" type="number" min="0" max="1440" required>';
  } else if (groupNum === 2) {
    diaryQuestions =
      "<p>1. What activities were you aware of your left-hand use in today?</p>" +
      '<textarea name="awareness_activities" rows="3" style="width:100%" required></textarea>' +
      "<p>2. Approximately how many minutes today were you aware of using your left hand?</p>" +
      '<input name="awareness_minutes" type="number" min="0" max="1440" required>' +
      "<p>3. What activities did you increase your left-hand use in today?</p>" +
      '<textarea name="increased_activities" rows="3" style="width:100%" required></textarea>';
  } else if (groupNum === 3) {
    diaryQuestions =
      "<p>1. What activities were you aware of your right-hand use in today?</p>" +
      '<textarea name="awareness_activities" rows="3" style="width:100%" required></textarea>' +
      "<p>2. Approximately how many minutes today were you aware of using your right hand?</p>" +
      '<input name="awareness_minutes" type="number" min="0" max="1440" required>';
  } else if (groupNum === 4) {
    diaryQuestions =
      "<p>1. What activities were you aware of your right-hand use in today?</p>" +
      '<textarea name="awareness_activities" rows="3" style="width:100%" required></textarea>' +
      "<p>2. Approximately how many minutes today were you aware of using your right hand?</p>" +
      '<input name="awareness_minutes" type="number" min="0" max="1440" required>' +
      "<p>3. What activities did you increase your right-hand use in today?</p>" +
      '<textarea name="increased_activities" rows="3" style="width:100%" required></textarea>';
  } else {
    // Group 5: no hand-specific questions
    diaryQuestions =
      "<p>1. How was the typing and writing activity today?</p>" +
      '<textarea name="general_experience" rows="3" style="width:100%" required></textarea>';
  }

  timeline.push({
    type: jsPsychSurveyHtmlForm,
    preamble: "<h3>Daily Diary</h3>",
    html:
      '<div style="max-width:600px; margin:auto; text-align:left;">' +
      diaryQuestions +
      "</div>",
    data: {
      task: "diary",
      day: day + 1,
      group: groupNum
    }
  });

  return timeline;
};

/* =========================================================
   POST-STUDY QUESTIONS (T2 only)
   ========================================================= */

TASKS.postStudy = function (jsPsych) {
  return [
    {
      type: jsPsychSurveyLikert,
      preamble: "<h2>Post-Study Questions</h2>",
      questions: [
        {
          prompt:
            "How much more skillful is your non-dominant hand now compared to the start of the study?",
          name: "skill_improvement",
          labels: [
            "0 – Not at all",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7 – Extremely"
          ],
          required: true
        },
        {
          prompt: "How much did you enjoy the daily typing activity?",
          name: "enjoyment",
          labels: [
            "0 – Not at all",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7 – Extremely"
          ],
          required: true
        }
      ],
      data: { task: "post_study_likert" }
    },
    {
      type: jsPsychSurveyText,
      questions: [
        {
          prompt:
            "Please briefly describe what you thought about the typing activity " +
            "(positive and/or negative aspects):",
          name: "typing_thoughts",
          rows: 4,
          required: false
        }
      ],
      data: { task: "post_study_text" }
    }
  ];
};
