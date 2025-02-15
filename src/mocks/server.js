import { createServer } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    routes() {
      // Existing routes...

      // Add passthrough for Gemini API
      this.passthrough("https://generativelanguage.googleapis.com/**");
      
      // Add passthrough for Google Maps
      this.passthrough("https://maps.googleapis.com/**");

      // Add Voiceflow passthroughs
      this.passthrough("https://general-runtime.voiceflow.com/**");
      this.passthrough("https://cdn.voiceflow.com/**");
    },
  });

  return server;
} 