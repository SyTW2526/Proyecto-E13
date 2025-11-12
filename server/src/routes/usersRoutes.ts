import { Router } from "express";
import {
  getProfile,
  deleteAccount,
  updateName,
  updateEmailNotificationSetting,
  updatePushNotificationSetting,
} from "../controllers/usersController";
import { authenticate } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validationMiddleware";
import {
  updateNameSchema,
  updateEmailNotificationSettingSchema,
  updatePushNotificationSettingSchema,
} from "../schemas/validationSchemas";

const router = Router();

router.get("/me", authenticate, getProfile);
router.delete("/me", authenticate, deleteAccount);
router.put(
  "/me/name",
  authenticate,
  validateBody(updateNameSchema),
  updateName,
);
router.put(
  "/me/email-notifications",
  authenticate,
  validateBody(updateEmailNotificationSettingSchema),
  updateEmailNotificationSetting,
);
router.put(
  "/me/push-notifications",
  authenticate,
  validateBody(updatePushNotificationSettingSchema),
  updatePushNotificationSetting,
);

export default router;
