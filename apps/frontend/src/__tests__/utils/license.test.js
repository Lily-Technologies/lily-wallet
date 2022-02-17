import { isAtLeastTier } from "../../utils/license";
const exampleLicense = {
    signature: "KPP1aFqppOLQAvfusPpw2+mED6sE4qF1RuZcS/vd67fycd/j7PSNcUGnUEn9ABNEtdXV9+XlNtiqBsuAYghBYjw=",
    license: "basic:721676:a1b6131ba536d9994afb0bac01936869a2d2f1d59eecb2d588727c4ab1e47dee",
};
describe("license.ts", () => {
    test("isAtLeastTier: ", () => {
        expect(isAtLeastTier(exampleLicense, "trial")).toBe(false);
        expect(isAtLeastTier(exampleLicense, "premium")).toBe(false);
        expect(isAtLeastTier(exampleLicense, "essential")).toBe(false);
        expect(isAtLeastTier(exampleLicense, "basic")).toBe(true);
        expect(isAtLeastTier(exampleLicense, "free")).toBe(true);
    });
});
//# sourceMappingURL=license.test.js.map