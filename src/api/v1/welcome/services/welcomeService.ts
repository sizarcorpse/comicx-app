export const greeting = {
  async welcome() {
    try {
      const data = "Welcome to the moon";
      return data;
    } catch (error) {
      throw error;
    }
  },
};
