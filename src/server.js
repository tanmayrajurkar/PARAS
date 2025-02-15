import { Server } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  return new Server({
    environment,
    
    routes() {
      // Ensure all Supabase requests bypass MirageJS
      this.passthrough(`${import.meta.env.VITE_SUPABASE_URL}/**`);
      this.passthrough("https://maps.googleapis.com/**");
      
      // Add Gemini API passthrough
      this.passthrough("https://generativelanguage.googleapis.com/**");
      
      // Add Voiceflow passthroughs
      this.passthrough("https://general-runtime.voiceflow.com/**");
      this.passthrough("https://cdn.voiceflow.com/**");
      
      // Add a general passthrough for any options requests
      this.passthrough((request) => {
        return request.method === "OPTIONS";
      });
    }
  });
}
