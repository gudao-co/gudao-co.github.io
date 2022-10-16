import { Alert } from 'flowbite-react';
import { useTranslation } from "../i18n";

function Home() {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto">
      <Alert color="info">
        <span>
          <span className="font-medium">
            {t('not implemented')}
          </span>
        </span>
      </Alert>
    </div>
  );
}

export default Home;
