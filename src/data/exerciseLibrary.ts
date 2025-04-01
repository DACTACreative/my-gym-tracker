export type ExerciseInfo = {
  id: string;
  name: string;
  muscleGroup: string;
  focus: string;
  description: string;
  video: string;
};

export type MuscleGroup = {
  name: string;
  exercises: ExerciseInfo[];
};

export const exerciseLibrary: MuscleGroup[] = [
  {
    name: "Shoulders",
    exercises: [
      {
        id: "shoulder-press",
        name: "Overhead Press",
        muscleGroup: "Shoulders",
        focus: "Front Deltoids",
        description: "Compound movement targeting the entire shoulder with emphasis on front deltoids",
        video: "https://www.youtube.com/embed/qEwKCR5JCog"
      },
      {
        id: "lateral-raise",
        name: "Lateral Raises",
        muscleGroup: "Shoulders",
        focus: "Middle Deltoids",
        description: "Isolation exercise for shoulder width and lateral deltoid development",
        video: "https://www.youtube.com/embed/3VcKaXpzqRo"
      },
      {
        id: "face-pull",
        name: "Face Pulls",
        muscleGroup: "Shoulders",
        focus: "Rear Deltoids",
        description: "Targets rear deltoids and improves shoulder health and posture",
        video: "https://www.youtube.com/embed/V8dZ3pyiCBo"
      },
      {
        id: "arnold-press",
        name: "Arnold Press",
        muscleGroup: "Shoulders",
        focus: "All Three Deltoid Heads",
        description: "Complete shoulder development with rotational movement",
        video: "https://www.youtube.com/embed/3ml7BH7mNwQ"
      },
      {
        id: "front-raise",
        name: "Front Raises",
        muscleGroup: "Shoulders",
        focus: "Front Deltoids",
        description: "Isolation movement for front shoulder development",
        video: "https://www.youtube.com/embed/sxeY7kMYhLc"
      },
      {
        id: "reverse-fly",
        name: "Reverse Flyes",
        muscleGroup: "Shoulders",
        focus: "Rear Deltoids",
        description: "Isolation exercise for rear deltoid development",
        video: "https://www.youtube.com/embed/9R5f4oIjwq8"
      },
      {
        id: "upright-row",
        name: "Upright Rows",
        muscleGroup: "Shoulders",
        focus: "Middle Deltoids & Traps",
        description: "Compound movement for shoulder and trap development",
        video: "https://www.youtube.com/embed/VG0nT4rXzDY"
      },
      {
        id: "shrug",
        name: "Barbell Shrugs",
        muscleGroup: "Shoulders",
        focus: "Trapezius",
        description: "Primary trap builder for upper back development",
        video: "https://www.youtube.com/embed/cJRVVxmytaM"
      }
    ]
  },
  {
    name: "Chest",
    exercises: [
      {
        id: "bench-press",
        name: "Bench Press",
        muscleGroup: "Chest",
        focus: "Overall Chest",
        description: "Primary chest builder, works the entire pectoral muscles",
        video: "https://www.youtube.com/embed/rT7DgCr-3pg"
      },
      {
        id: "incline-press",
        name: "Incline Press",
        muscleGroup: "Chest",
        focus: "Upper Chest",
        description: "Emphasizes upper chest development",
        video: "https://www.youtube.com/embed/8iPEnn-ltC8"
      },
      {
        id: "dips",
        name: "Chest Dips",
        muscleGroup: "Chest",
        focus: "Lower Chest",
        description: "Bodyweight exercise targeting lower chest and triceps",
        video: "https://www.youtube.com/embed/dX_nSOOJIsE"
      },
      {
        id: "decline-press",
        name: "Decline Press",
        muscleGroup: "Chest",
        focus: "Lower Chest",
        description: "Targets lower portion of the chest",
        video: "https://www.youtube.com/embed/LfyQBUKR8SE"
      },
      {
        id: "flyes",
        name: "Dumbbell Flyes",
        muscleGroup: "Chest",
        focus: "Chest Stretch & Inner Chest",
        description: "Isolation movement for chest width and stretch",
        video: "https://www.youtube.com/embed/eozdVDA78K0"
      },
      {
        id: "cable-crossover",
        name: "Cable Crossovers",
        muscleGroup: "Chest",
        focus: "Inner Chest",
        description: "Isolation exercise for chest contraction and inner chest",
        video: "https://www.youtube.com/embed/taI4XduLpTk"
      },
      {
        id: "pushups",
        name: "Push-Ups",
        muscleGroup: "Chest",
        focus: "Overall Chest & Core",
        description: "Bodyweight exercise for chest and core strength",
        video: "https://www.youtube.com/embed/IODxDxX7oi4"
      },
      {
        id: "landmine-press",
        name: "Landmine Press",
        muscleGroup: "Chest",
        focus: "Upper Chest & Shoulders",
        description: "Dynamic pressing movement for chest and shoulder development",
        video: "https://www.youtube.com/embed/1G-_FTEkoNw"
      }
    ]
  },
  {
    name: "Back",
    exercises: [
      {
        id: "pull-up",
        name: "Pull-Ups",
        muscleGroup: "Back",
        focus: "Upper Back",
        description: "Compound movement for overall back development",
        video: "https://www.youtube.com/embed/eGo4IYlbE5g"
      },
      {
        id: "row",
        name: "Barbell Row",
        muscleGroup: "Back",
        focus: "Middle Back",
        description: "Targets mid-back muscles and improves posture",
        video: "https://www.youtube.com/embed/G8l_8chR5BE"
      },
      {
        id: "lat-pulldown",
        name: "Lat Pulldown",
        muscleGroup: "Back",
        focus: "Lats",
        description: "Isolation exercise for lat development",
        video: "https://www.youtube.com/embed/CAwf7n6Luuc"
      },
      {
        id: "deadlift",
        name: "Deadlift",
        muscleGroup: "Back",
        focus: "Overall Back & Posterior Chain",
        description: "Primary compound movement for back strength",
        video: "https://www.youtube.com/embed/op9kVnSso6Q"
      },
      {
        id: "seated-cable-row",
        name: "Seated Cable Row",
        muscleGroup: "Back",
        focus: "Middle Back",
        description: "Cable exercise for back thickness",
        video: "https://www.youtube.com/embed/GZbfZ033f74"
      },
      {
        id: "single-arm-row",
        name: "Single-Arm Dumbbell Row",
        muscleGroup: "Back",
        focus: "Lats & Middle Back",
        description: "Unilateral back exercise for balanced development",
        video: "https://www.youtube.com/embed/pYcpY20QaE8"
      },
      {
        id: "meadows-row",
        name: "Meadows Row",
        muscleGroup: "Back",
        focus: "Lats & Upper Back",
        description: "Unique angle for back development",
        video: "https://www.youtube.com/embed/0DDVqXKG7JA"
      },
      {
        id: "face-pull",
        name: "Face Pull",
        muscleGroup: "Back",
        focus: "Rear Deltoids & Upper Back",
        description: "Upper back and shoulder health exercise",
        video: "https://www.youtube.com/embed/rep-qVOkqgk"
      }
    ]
  },
  {
    name: "Legs",
    exercises: [
      {
        id: "squat",
        name: "Squats",
        muscleGroup: "Legs",
        focus: "Overall Legs",
        description: "Primary leg builder, works entire lower body",
        video: "https://www.youtube.com/embed/ultWZbUMPL8"
      },
      {
        id: "deadlift",
        name: "Romanian Deadlift",
        muscleGroup: "Legs",
        focus: "Hamstrings",
        description: "Targets posterior chain, especially hamstrings",
        video: "https://www.youtube.com/embed/JCXUYuzwNrM"
      },
      {
        id: "lunges",
        name: "Walking Lunges",
        muscleGroup: "Legs",
        focus: "Quads & Balance",
        description: "Unilateral exercise for leg development and stability",
        video: "https://www.youtube.com/embed/L8fvypPrzzs"
      },
      {
        id: "leg-press",
        name: "Leg Press",
        muscleGroup: "Legs",
        focus: "Quads & Overall Legs",
        description: "Machine compound movement for leg development",
        video: "https://www.youtube.com/embed/IZxyjW7MPJQ"
      },
      {
        id: "leg-extension",
        name: "Leg Extensions",
        muscleGroup: "Legs",
        focus: "Quadriceps",
        description: "Isolation exercise for quad development",
        video: "https://www.youtube.com/embed/YyvSfVjQeL0"
      },
      {
        id: "leg-curl",
        name: "Leg Curls",
        muscleGroup: "Legs",
        focus: "Hamstrings",
        description: "Isolation exercise for hamstring development",
        video: "https://www.youtube.com/embed/1Tq3QdYUuHs"
      },
      {
        id: "calf-raise",
        name: "Standing Calf Raises",
        muscleGroup: "Legs",
        focus: "Calves",
        description: "Primary calf builder",
        video: "https://www.youtube.com/embed/gwLzBJYoWlI"
      },
      {
        id: "bulgarian-split-squat",
        name: "Bulgarian Split Squats",
        muscleGroup: "Legs",
        focus: "Quads & Balance",
        description: "Unilateral leg exercise for strength and stability",
        video: "https://www.youtube.com/embed/2C-uNgKwPLE"
      }
    ]
  },
  {
    name: "Arms",
    exercises: [
      {
        id: "bicep-curl",
        name: "Bicep Curls",
        muscleGroup: "Arms",
        focus: "Biceps",
        description: "Classic bicep builder for arm development",
        video: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
      },
      {
        id: "tricep-extension",
        name: "Tricep Extensions",
        muscleGroup: "Arms",
        focus: "Triceps",
        description: "Isolation exercise for tricep development",
        video: "https://www.youtube.com/embed/nRiJVZDpdL0"
      },
      {
        id: "hammer-curl",
        name: "Hammer Curls",
        muscleGroup: "Arms",
        focus: "Forearms & Biceps",
        description: "Targets forearms and bicep thickness",
        video: "https://www.youtube.com/embed/zC3nLlEvin4"
      },
      {
        id: "preacher-curl",
        name: "Preacher Curls",
        muscleGroup: "Arms",
        focus: "Lower Biceps",
        description: "Isolation exercise for lower bicep development",
        video: "https://www.youtube.com/embed/fIWP-FRFNU0"
      },
      {
        id: "skull-crusher",
        name: "Skull Crushers",
        muscleGroup: "Arms",
        focus: "Triceps",
        description: "Lying tricep extension for tricep development",
        video: "https://www.youtube.com/embed/d_KZxkY_0cM"
      },
      {
        id: "concentration-curl",
        name: "Concentration Curls",
        muscleGroup: "Arms",
        focus: "Peak Biceps",
        description: "Isolation exercise for bicep peak development",
        video: "https://www.youtube.com/embed/0AUGkch3tzc"
      },
      {
        id: "diamond-pushup",
        name: "Diamond Push-Ups",
        muscleGroup: "Arms",
        focus: "Triceps",
        description: "Bodyweight exercise for tricep development",
        video: "https://www.youtube.com/embed/J0DnG1_S92I"
      },
      {
        id: "reverse-curl",
        name: "Reverse Curls",
        muscleGroup: "Arms",
        focus: "Forearms & Brachialis",
        description: "Targets forearms and brachialis muscle",
        video: "https://www.youtube.com/embed/nRiJVZDpdL0"
      }
    ]
  },
  {
    name: "Core",
    exercises: [
      {
        id: "plank",
        name: "Plank",
        muscleGroup: "Core",
        focus: "Overall Core Stability",
        description: "Isometric exercise for core strength and stability",
        video: "https://www.youtube.com/embed/pSHjTRCQxIw"
      },
      {
        id: "russian-twist",
        name: "Russian Twists",
        muscleGroup: "Core",
        focus: "Obliques",
        description: "Rotational movement for oblique development",
        video: "https://www.youtube.com/embed/wkD8rjkodUI"
      },
      {
        id: "leg-raise",
        name: "Leg Raises",
        muscleGroup: "Core",
        focus: "Lower Abs",
        description: "Targets lower abdominal region",
        video: "https://www.youtube.com/embed/l4kQd9eWclE"
      },
      {
        id: "cable-crunch",
        name: "Cable Crunches",
        muscleGroup: "Core",
        focus: "Upper Abs",
        description: "Weighted exercise for upper ab development",
        video: "https://www.youtube.com/embed/2fbujeH3F0E"
      },
      {
        id: "woodchop",
        name: "Cable Woodchops",
        muscleGroup: "Core",
        focus: "Rotational Core Strength",
        description: "Dynamic movement for core rotation and stability",
        video: "https://www.youtube.com/embed/pAplQXk3dkU"
      },
      {
        id: "ab-wheel",
        name: "Ab Wheel Rollouts",
        muscleGroup: "Core",
        focus: "Complete Core",
        description: "Advanced exercise for total core development",
        video: "https://www.youtube.com/embed/rqiTPdK1c_I"
      },
      {
        id: "hanging-leg-raise",
        name: "Hanging Leg Raises",
        muscleGroup: "Core",
        focus: "Lower Abs & Hip Flexors",
        description: "Advanced movement for lower ab strength",
        video: "https://www.youtube.com/embed/Pr1ieGZ5atk"
      },
      {
        id: "pallof-press",
        name: "Pallof Press",
        muscleGroup: "Core",
        focus: "Anti-Rotation",
        description: "Builds core stability and anti-rotation strength",
        video: "https://www.youtube.com/embed/AH_QZLm_0-s"
      }
    ]
  }
];
