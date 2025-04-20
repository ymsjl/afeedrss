
export function getRootStreamId(userId: string) {
  return userId ? `user/${userId}/state/com.google/root` : '';
}
