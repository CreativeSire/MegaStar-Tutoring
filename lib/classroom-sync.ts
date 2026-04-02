export type ClassroomBoardPoint = {
  x: number;
  y: number;
};

export type ClassroomBoardStroke = {
  id: string;
  type: "stroke";
  tool: "pen" | "marker" | "erase";
  color: string;
  width: number;
  points: ClassroomBoardPoint[];
};

export type ClassroomBoardText = {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
};

export type ClassroomBoardShape = {
  id: string;
  type: "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type ClassroomBoardImage = {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  source: string;
};

export type ClassroomBoardAction =
  | ClassroomBoardStroke
  | ClassroomBoardText
  | ClassroomBoardShape
  | ClassroomBoardImage;

export type ClassroomBoardSnapshot = {
  source: string;
  revision: number;
  boardLabel: string;
  actions: ClassroomBoardAction[];
  updatedAt: string;
};

export type ClassroomRoomParticipant = {
  id: string;
  name: string;
  role: string;
  active?: boolean;
  speaking?: boolean;
};

export type ClassroomSyncBridge = {
  connected: boolean;
  roomName: string;
  sourceId: string;
  participantCount: number;
  publishSnapshot: (snapshot: ClassroomBoardSnapshot) => Promise<void>;
};

export type ClassroomArchive = {
  id: string;
  title: string;
  summary: string;
  boardLabel: string;
  snapshotJson: string;
  fileName: string;
  createdAt: string;
};

type SnapshotInput = Omit<ClassroomBoardSnapshot, "updatedAt">;

export function createClassroomBoardSnapshot(input: SnapshotInput): ClassroomBoardSnapshot {
  return {
    ...input,
    updatedAt: new Date().toISOString(),
  };
}

export function parseClassroomBoardSnapshot(value: string) {
  try {
    const parsed = JSON.parse(value) as ClassroomBoardSnapshot;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (typeof parsed.source !== "string" || typeof parsed.revision !== "number" || typeof parsed.boardLabel !== "string") {
      return null;
    }

    if (!Array.isArray(parsed.actions)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
