const { test, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("../server");

let server, base;
before(() => {
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

test("helmet sets security headers", async () => {
  const res = await fetch(base + "/");
  assert.strictEqual(res.status, 201);
  assert.ok(res.headers.get("content-security-policy"));
});

test("protected route rejects requests without the token cookie", async () => {
  const res = await fetch(base + "/api/registrations/my");
  assert.strictEqual(res.status, 401);
});
