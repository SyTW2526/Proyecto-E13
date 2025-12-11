import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock prisma
vi.mock("../src/database/prisma", () => ({
  default: {
    task: {
      deleteMany: vi.fn(),
    },
  },
}));

import prisma from "../src/database/prisma";
import {
  cleanupOldCompletedTasks,
  startCleanupJob,
} from "../src/jobs/cleanupTasks";

describe("cleanupOldCompletedTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete tasks completed more than 7 days ago", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockResolvedValue({ count: 5 });

    const result = await cleanupOldCompletedTasks();

    expect(result).toBe(5);
    expect(mockDeleteMany).toHaveBeenCalledTimes(1);
    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: {
        status: "COMPLETED",
        completedAt: {
          lte: expect.any(Date),
        },
      },
    });
  });

  it("should return 0 when no tasks are deleted", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockResolvedValue({ count: 0 });

    const result = await cleanupOldCompletedTasks();

    expect(result).toBe(0);
  });

  it("should return 0 and log error when deletion fails", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockRejectedValue(new Error("Database error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await cleanupOldCompletedTasks();

    expect(result).toBe(0);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should use correct date threshold (7 days ago)", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockResolvedValue({ count: 0 });

    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    await cleanupOldCompletedTasks();

    const expectedThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const calledWith = mockDeleteMany.mock.calls[0][0];
    const completedAt = calledWith?.where?.completedAt as { lte?: Date };

    expect(completedAt?.lte?.getTime()).toBeCloseTo(
      expectedThreshold.getTime(),
      -3,
    );

    vi.restoreAllMocks();
  });
});

describe("startCleanupJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should call cleanupOldCompletedTasks immediately", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockResolvedValue({ count: 0 });

    startCleanupJob();

    // Wait for the immediate call to complete
    await vi.waitFor(() => {
      expect(mockDeleteMany).toHaveBeenCalledTimes(1);
    });
  });

  it("should setup interval to call cleanupOldCompletedTasks every hour", async () => {
    const mockDeleteMany = vi.mocked(prisma.task.deleteMany);
    mockDeleteMany.mockResolvedValue({ count: 0 });

    startCleanupJob();

    // Wait for the immediate call
    await vi.waitFor(() => {
      expect(mockDeleteMany).toHaveBeenCalledTimes(1);
    });

    // Advance time by 1 hour
    vi.advanceTimersByTime(60 * 60 * 1000);

    // Wait for the interval call
    await vi.waitFor(() => {
      expect(mockDeleteMany).toHaveBeenCalledTimes(2);
    });

    // Advance time by another hour
    vi.advanceTimersByTime(60 * 60 * 1000);

    // Wait for the second interval call
    await vi.waitFor(() => {
      expect(mockDeleteMany).toHaveBeenCalledTimes(3);
    });
  });
});
