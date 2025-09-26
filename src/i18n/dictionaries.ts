export type Locale = "en" | "vi";

export type Dictionary = {
  appTitle: string;
  phases: { work: string; short: string; long: string };
  actions: { start: string; pause: string; reset: string; skip: string; enableNotifications: string };
  labels: { completed: string };
  settings: {
    title: string;
    workMinutes: string;
    shortBreakMinutes: string;
    longBreakMinutes: string;
    cyclesBeforeLong: string;
    autoStartNext: string;
    soundOn: string;
    soundType: string;
    soundVolume: string;
    testSound: string;
  };
  notifications: { sessionEnded: string };
  tasks: {
    title: string;
    addPlaceholder: string;
    addButton: string;
    active: string;
    complete: string;
    delete: string;
    empty: string;
  };
  inbox: {
    title: string;
    addQuick: string;
    placeholder: string;
    empty: string;
  };
  achievements: {
    title: string;
    noPause3: string;
    threeBefore11: string;
    distanceLabel: string;
  };
  review: {
    title: string;
    last28Days: string;
    minutes: string;
  };
  ambient: {
    title: string;
    enable: string;
    volume: string;
  };
  pwa: {
    installedHint: string;
  };
  journey: {
    title: string;
    traveled: string;
    stage: string;
    mediaHint: string;
    videoTitle: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    appTitle: "Pomodoro",
    phases: { work: "Work", short: "Short break", long: "Long break" },
    actions: {
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      skip: "Skip",
      enableNotifications: "Enable browser notifications",
    },
    labels: { completed: "Completed" },
    settings: {
      title: "Settings",
      workMinutes: "Work (minutes)",
      shortBreakMinutes: "Short break (minutes)",
      longBreakMinutes: "Long break (minutes)",
      cyclesBeforeLong: "Sessions before long break",
      autoStartNext: "Auto start next phase",
      soundOn: "Enable alert sound",
      soundType: "Alert sound",
      soundVolume: "Alert volume",
      testSound: "Test sound",
    },
    notifications: { sessionEnded: "Session ended" },
    tasks: {
      title: "Tasks",
      addPlaceholder: "Add a new task...",
      addButton: "Add",
      active: "Active",
      complete: "Complete",
      delete: "Delete",
      empty: "No tasks yet",
    },
    inbox: {
      title: "Inbox",
      addQuick: "Quick add (I)",
      placeholder: "Jot it down...",
      empty: "Nothing in inbox",
    },
    achievements: {
      title: "Achievements",
      noPause3: "3 focus sessions without pausing",
      threeBefore11: "3 tasks done before 11 AM",
      distanceLabel: "km flown",
    },
    review: {
      title: "Review",
      last28Days: "Last 28 days",
      minutes: "minutes",
    },
    ambient: {
      title: "Ambient",
      enable: "Enable ambient sound",
      volume: "Volume",
    },
    pwa: {
      installedHint: "Tip: Install to your home screen from the browser menu.",
    },
    journey: {
      title: "Journey",
      traveled: "Traveled",
      stage: "Stage",
      mediaHint: "Optional: add /public/journey images (1.jpg, 2.jpg, ...) or /public/flight.mp4 to visualize your flight.",
      videoTitle: "Flight video",
    },
  },
  vi: {
    appTitle: "Pomodoro",
    phases: { work: "Làm việc", short: "Nghỉ ngắn", long: "Nghỉ dài" },
    actions: {
      start: "Bắt đầu",
      pause: "Tạm dừng",
      reset: "Đặt lại",
      skip: "Bỏ qua",
      enableNotifications: "Bật thông báo trình duyệt",
    },
    labels: { completed: "Đã hoàn thành" },
    settings: {
      title: "Cài đặt",
      workMinutes: "Phiên làm (phút)",
      shortBreakMinutes: "Nghỉ ngắn (phút)",
      longBreakMinutes: "Nghỉ dài (phút)",
      cyclesBeforeLong: "Số phiên trước nghỉ dài",
      autoStartNext: "Tự động bắt đầu phiên kế tiếp",
      soundOn: "Bật âm thanh báo",
      soundType: "Loại âm báo",
      soundVolume: "Âm lượng báo",
      testSound: "Nghe thử",
    },
    notifications: { sessionEnded: "Hết phiên" },
    tasks: {
      title: "Nhiệm vụ",
      addPlaceholder: "Thêm nhiệm vụ mới...",
      addButton: "Thêm",
      active: "Đang làm",
      complete: "Hoàn thành",
      delete: "Xoá",
      empty: "Chưa có nhiệm vụ nào",
    },
    inbox: {
      title: "Inbox",
      addQuick: "Thêm nhanh (I)",
      placeholder: "Ghi nhanh ý nghĩ...",
      empty: "Không có mục nào",
    },
    achievements: {
      title: "Thành tựu",
      noPause3: "3 phiên làm việc liền không tạm dừng",
      threeBefore11: "Hoàn thành 3 nhiệm vụ trước 11 giờ",
      distanceLabel: "km đã bay",
    },
    review: {
      title: "Tổng kết",
      last28Days: "28 ngày gần đây",
      minutes: "phút",
    },
    ambient: {
      title: "Âm cảnh",
      enable: "Bật âm thanh nền",
      volume: "Âm lượng",
    },
    pwa: {
      installedHint: "Mẹo: Cài ứng dụng ra màn hình chính từ menu trình duyệt.",
    },
    journey: {
      title: "Hành trình",
      traveled: "Đã đi",
      stage: "Chặng",
      mediaHint: "Tuỳ chọn: thêm ảnh vào /public/journey (1.jpg, 2.jpg, ...) hoặc video /public/flight.mp4 để trực quan hoá chuyến bay.",
      videoTitle: "Video chuyến bay",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
