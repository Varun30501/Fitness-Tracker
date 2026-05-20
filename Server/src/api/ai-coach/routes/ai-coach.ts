export default {
  routes: [
    {
      method: "POST",
      path: "/ai-coach",
      handler: "ai-coach.ask",
      config: { auth: false },
    },
  ],
};
