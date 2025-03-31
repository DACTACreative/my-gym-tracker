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
      }
    ]
  }
];
