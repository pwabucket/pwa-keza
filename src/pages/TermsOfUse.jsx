import InnerAppLayout from "../layouts/InnerAppLayout";
import MarkdownRender from "../components/MarkdownRenderer";
import termsOfUse from "../../terms-of-use.md?raw";

export default function TermsOfUse() {
  return (
    <InnerAppLayout headerTitle="Terms of Use">
      <MarkdownRender content={termsOfUse} />
    </InnerAppLayout>
  );
}
