import { beforeEach, describe, expect, it, vi } from "vitest";
const { rpc, getUser, revalidatePath } = vi.hoisted(() => ({ rpc: vi.fn(), getUser: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser }, rpc }) }));
vi.mock("next/cache", () => ({ revalidatePath }));
import { joinTeam } from "./team-actions";
function form(code: string) { const f = new FormData(); f.set("code", code); return f; }
describe("join workspace action", () => {
 beforeEach(() => { vi.clearAllMocks(); getUser.mockResolvedValue({ data: { user: { id: "member" } } }); });
 it("rejects invalid codes without querying the database", async () => { expect((await joinTeam({}, form("bad"))).error).toBeTruthy(); expect(rpc).not.toHaveBeenCalled(); });
 it("requires a signed-in user", async () => { getUser.mockResolvedValue({ data: { user: null } }); expect((await joinTeam({}, form("a".repeat(48)))).error).toContain("sign in"); expect(rpc).not.toHaveBeenCalled(); });
 it("shows database rejection without reporting success", async () => { rpc.mockResolvedValue({ error: { message: "Invalid workspace join code" } }); expect((await joinTeam({}, form("a".repeat(48)))).error).toContain("Invalid"); expect(revalidatePath).not.toHaveBeenCalled(); });
 it("refreshes workspace pages after a successful join", async () => { rpc.mockResolvedValue({ error: null }); const result = await joinTeam({}, form("a".repeat(48))); expect(rpc).toHaveBeenCalledWith("join_workspace", { invite_code: "a".repeat(48) }); expect(result.href).toBe("/jobs"); expect(revalidatePath).toHaveBeenCalledWith("/", "layout"); });
});
