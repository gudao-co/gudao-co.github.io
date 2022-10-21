import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../../i18n";
import useWallet from '../../use/useWallet';
import { setWalletChooses } from '../../use/useWalletChooses';
import useWalletReady from '../../use/useWalletReady';
import { createSkill, Skill } from 'gudao-co-core/dist/skill';
import { TX } from 'gudao-co-core/dist/progress';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';

function SkillCreate() {
  const { t } = useTranslation()
  const [wallet,] = useWallet()
  const [isReady,] = useWalletReady()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [errmsg, setErrmsg] = useState('')
  const [tx, setTX] = useState<TX>()
  const [skill, setKill] = useState<Skill>()
  const navigate = useNavigate()
  const [gistURL, setGistURL] = useState('')

  if (!isReady) {
    return (<></>)
  }

  if (!wallet) {
    setWalletChooses({ allowClosed: false })
    return (<></>)
  }

  const onSubmit = () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrmsg('')
    createSkill({ gistURL: gistURL }, (s) => {
      if (s.name === 'tx') {
        setTX(s.tx!)
      } else if (s.title) {
        setProgress(s.title)
      }
    }).then((rs) => {
      setKill(rs)
      setLoading(false)
    }, (reason) => {
      setErrmsg(getErrmsg(reason))
      setLoading(false)
    })
    return false;
  };

  let failureAlert = <></>

  if (errmsg) {
    failureAlert =
      <div className='pt-4'>
        <Alert
          color="failure"
          icon={HiInformationCircle}
        >
          <span>
            {errmsg}
          </span>
        </Alert>
      </div>
  }

  let loadingSpinner = (light: boolean = true) => {
    return <></>
  }

  if (loading) {
    loadingSpinner = (light: boolean = true) => {
      return <Spinner color="success" size="sm" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
    }
  }

  let infoAlert = <></>

  if (skill) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color="info"
          icon={HiInformationCircle}
        >
          <span>
            <span className="font-medium">
              {'Skill: '}
            </span>
            <a href={'/skill/' + skill.id}>{skill.erc721_name + '#' + skill.id}</a>
            <span className="font-medium">
              {' waitting 6s redirect ...'}
            </span>
          </span>
        </Alert>
      </div>
    setTimeout(() => {
      navigate('/skill/' + skill.id)
    }, 6000);
  } else if (tx) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color="info"
          icon={loading ? undefined : TiTick}
        >
          <span>
            {loadingSpinner(false)}
            <span className="font-medium align-middle">
              {'TX: '}
            </span>
            <a href={tx.url} target="_blank" rel="noreferrer" className='align-middle'>{tx.hash.substring(0, 6) + '...' + tx.hash.substring(tx.hash.length - 6)}</a>
          </span>
        </Alert>
      </div>
  }

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          {t('Create Skill')}
        </div>
      </div>
      {failureAlert}
      {infoAlert}
      <div className='pt-4'>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); return onSubmit(); }}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="owner"
                  value="Owner"
                />
              </div>
              <TextInput
                id="owner"
                type="text"
                readOnly={true}
                value={wallet.addr}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="gist"
                  value="GIST URL"
                />
              </div>
              <TextInput
                id="gist"
                type="text"
                value={gistURL}
                onChange={(e) => setGistURL(e.currentTarget.value)}
                placeholder="https://gist.github.com/:USERNAME/:GIST_ID"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loadingSpinner(true)}
              {t(loading ? progress : 'Create')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SkillCreate;
