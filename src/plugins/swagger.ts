import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerui from "@fastify/swagger-ui";

export default fp(async function (fastify) {
  await fastify.register(swagger, {
    mode: "dynamic",
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API Usuarios y Tareas",
        description: "Plantilla preparada a partir del skeleton ts.zip",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3000", description: "Development server" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await fastify.register(swaggerui, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "none", deepLinking: false },
  });
});
