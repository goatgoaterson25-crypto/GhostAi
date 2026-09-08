export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { prompt } = await request.json();
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt: prompt,
        num_steps: 4
      });

      const binaryString = atob(response.image);
      const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));

      return new Response(img, {
        headers: { "Content-Type": "image/jpeg" },
      });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
