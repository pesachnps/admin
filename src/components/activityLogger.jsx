import { ActivityLog } from "@/api/entities";
import { User } from "@/api/entities";

const getClientIP = () => {
  // This is a fallback - in a real application, you'd want to get the actual IP
  // from the server or a service that can detect the real client IP
  return "127.0.0.1"; // Placeholder IP
};

const getUserAgent = () => {
  return navigator.userAgent;
};

export const logActivity = async (actionType, title, description, details = null) => {
  try {
    // Get current user info
    const user = await User.me();
    
    // Create activity log entry
    await ActivityLog.create({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name,
      action_type: actionType,
      title: title,
      description: description,
      ip_address: getClientIP(),
      user_agent: getUserAgent(),
      details: details ? JSON.stringify(details) : null
    });
  } catch (error) {
    // If user is not logged in or there's an error, log as system activity
    console.warn('Could not log user activity, logging as system:', error);
    try {
      await ActivityLog.create({
        action_type: actionType,
        title: title,
        description: description,
        ip_address: getClientIP(),
        user_agent: getUserAgent(),
        details: details ? JSON.stringify(details) : null
      });
    } catch (systemError) {
      console.error('Failed to log activity:', systemError);
    }
  }
};