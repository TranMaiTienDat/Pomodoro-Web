import { I18nProvider } from "../../i18n/I18nProvider";
import { getDictionary, type Locale } from "../../i18n/dictionaries";
import FocusBoard from "../../components/FocusBoard";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = (lang === "en" || lang === "vi") ? lang : "vi";
  const dict = getDictionary(locale);
  return (
    <div className="min-h-screen w-full grid place-items-center p-6">
      <I18nProvider locale={locale} dict={dict}>
        <div className="flex flex-col items-center gap-3">
          <FocusBoard />
          <LanguageSwitcher />
        </div>
      </I18nProvider>
    </div>
  );
}
