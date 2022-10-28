import { Alert, Button, Card, Label, Select, Spinner, TextInput } from 'flowbite-react';
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
import useNetwork from '../../use/useNetwork';
import { Currency, CurrencyValue, newValue } from 'gudao-co-core/dist/currency';
import { getBalance } from 'gudao-co-core/dist/balance';
import { deposit, getBalance as getProjectBalance } from 'gudao-co-core/dist/project';

function ProjDeposit() {
  const { t } = useTranslation()
  const [wallet,] = useWallet()
  const [isReady,] = useWalletReady()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [errmsg, setErrmsg] = useState('')
  const [tx, setTX] = useState<TX>()
  const [searchParams,] = useSearchParams()
  const [network,] = useNetwork()
  const [amount, setAmount] = useState(searchParams.get('amount') || '100')
  const [currency, setCurrency] = useState<Currency>()
  const [balances, setBlanances] = useState<CurrencyValue[]>()
  const navigate = useNavigate()
  const [balancesLoading, setBalancesLoading] = useState(false)

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

  let currCurrency = currency

  if (!currCurrency) {
    if (searchParams.get('currency')) {
      let v = searchParams.get('currency')
      for (let item of network!.currencys) {
        if (item.addr === v) {
          currCurrency = item
          setCurrency(item)
          break
        }
      }
    } else {
      currCurrency = network!.currencys[0]
      setCurrency(currCurrency)
    }
  }

  const updateWalletBalance = (curr?: Currency) => {
    if (!curr) {
      curr = currCurrency
    }
    if (curr && wallet) {
      setBalancesLoading(true)
      Promise.all([getProjectBalance(id, curr), getBalance(wallet, wallet.addr, curr)]).then((rs) => {
        setBlanances(rs)
        setBalancesLoading(false)
      }, (reason) => {
        setErrmsg(getErrmsg(reason))
        setBalancesLoading(false)
      })
    }
  };

  const onSubmit = () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrmsg('')
    setTX(undefined)
    deposit(id!, newValue(amount, currCurrency!), (s) => {
      if (s.name === 'tx') {
        setTX(s.tx!)
      } else if (s.title) {
        setProgress(s.title)
      }
    }).then((rs) => {
      updateWalletBalance()
      setLoading(false)
    }, (reason) => {
      setErrmsg(getErrmsg(reason))
      setLoading(false)
    })
    return false;
  };

  const onCurrency = (addr: string) => {
    if (network) {
      for (let item of network.currencys) {
        if (item.addr === addr) {
          setCurrency(item)
          setBlanances(undefined)
          updateWalletBalance(item)
          break
        }
      }
    }
  }

  if (!errmsg && currCurrency && wallet && !balances && !balancesLoading) {
    updateWalletBalance()
  }

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
          Deposit
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
                  htmlFor="currency"
                  value="Currency"
                />
              </div>
              <Select id="currency"
                value={currCurrency ? currCurrency.addr : ''}
                onChange={(e) => onCurrency(e.currentTarget.value)}
                required={true}
                disabled={loading}
                color="info">
                {
                  network!.currencys.map(item => (
                    <option value={item.addr} key={item.addr}>{item.name}</option>
                  ))
                }
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="currentBalance"
                  value="Current Balance"
                />
              </div>
              <TextInput
                id="currentBalance"
                type="text"
                value={balances ? balances[0].value : '--'}
                readOnly={true}
                addon={currCurrency ? currCurrency.symbol : ""}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="walletBalance"
                  value="Wallet Balance"
                />
              </div>
              <TextInput
                id="walletBalance"
                type="text"
                value={balances ? balances[1].value : '--'}
                readOnly={true}
                addon={currCurrency ? currCurrency.symbol : ""}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="amount"
                  value="Amount"
                />
              </div>
              <TextInput
                id="amount"
                type="number"
                value={amount}
                inputMode="decimal"
                color="info"
                onChange={(e) => setAmount(e.currentTarget.value)}
                addon={currCurrency ? currCurrency.symbol : ""}
                required={true}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !currency}>
              {loadingSpinner(true)}
              {t(loading ? progress : 'Deposit')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProjDeposit;
