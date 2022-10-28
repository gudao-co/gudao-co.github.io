import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../../i18n";
import useWallet from '../../use/useWallet';
import { setWalletChooses } from '../../use/useWalletChooses';
import useWalletReady from '../../use/useWalletReady';
import { TX } from 'gudao-co-core/dist/progress';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { unGrant } from 'gudao-co-core/dist/skill';

function SkillUnGrant() {
  const { t } = useTranslation()
  const [wallet,] = useWallet()
  const [isReady,] = useWalletReady()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [errmsg, setErrmsg] = useState('')
  const [tx, setTX] = useState<TX>()
  const [searchParams,] = useSearchParams()
  const [addr, setAddr] = useState(searchParams.get('addr') || '')
  const navigate = useNavigate()

  const id = searchParams.get('id')

  if (!id) {
    navigate('/')
    return (<></>)
  }

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
    setTX(undefined)
    unGrant(id!, addr, (s) => {
      if (s.name === 'tx') {
        setTX(s.tx!)
      } else if (s.title) {
        setProgress(s.title)
      }
    }).then((rs) => {
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

  let isAddress = ()=> {
    return /(^0x[0-9a-fA-F]{40,40}$)|(\.ens$)/i.test(addr)
  }

  if (tx) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color={loading ? 'info' : 'success'}
          icon={loading ? undefined : TiTick}
        >
          <span>
            {loadingSpinner(false)}
            <span className="font-medium align-middle">
              {'TX: '}
            </span>
            <a href={tx.url} target="_blank" rel="noreferrer" className='align-middle'>{tx.hash.substring(0, 12) + '...' + tx.hash.substring(tx.hash.length - 6)}</a>
          </span>
        </Alert>
      </div>
  }

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          Grant
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
                  htmlFor="addr"
                  value="Wallet Address"
                />
              </div>
              <TextInput
                id="addr"
                type="text"
                value={addr}
                color="info"
                onChange={(e) => setAddr(e.currentTarget.value)}
                placeholder="0x0000000000000000000000000000000000000000 / .ens"
                required={true}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !isAddress()}>
              {loadingSpinner(true)}
              {t(loading ? progress : 'Ungrant')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SkillUnGrant;
