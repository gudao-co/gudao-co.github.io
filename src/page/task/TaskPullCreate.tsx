import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from "../../i18n";
import useWallet from '../../use/useWallet';
import { setWalletChooses } from '../../use/useWalletChooses';
import useWalletReady from '../../use/useWalletReady';
import { getSkills, setPullRequest, Task } from 'gudao-co-core/dist/task';
import { TX } from 'gudao-co-core/dist/progress';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { useState } from 'react';
import { HiBadgeCheck, HiInformationCircle } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TiTick } from 'react-icons/ti';
import { nextTick } from 'process';
import { Skill } from 'gudao-co-core/dist/skill';
import SkillIsGrant from '../../view/SkillIsGrant';

function TaskPullCreate() {
  const { t } = useTranslation()
  const [wallet,] = useWallet()
  const [isReady,] = useWalletReady()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [errmsg, setErrmsg] = useState('')
  const [tx, setTX] = useState<TX>()
  const [task, setTask] = useState<Task>()
  const navigate = useNavigate()
  const [pullRequestURL, setPullRequestURL] = useState('')
  const [params,] = useSearchParams()
  const task_id = params.get('task_id')
  const [skills, setSkills] = useState<Skill[]>()
  const [loadingSkills, setLoadingSkills] = useState(false)

  if (!task_id) {
    nextTick(() => {
      navigate('/')
    })
    return (<></>)
  }

  if (!isReady) {
    return (<></>)
  }

  if (!wallet) {
    setWalletChooses({ allowClosed: false })
    return (<></>)
  }

  if (skills === undefined && !loadingSkills) {
    setLoadingSkills(true)
    getSkills(task_id).then((rs) => {
      setLoadingSkills(false)
      setSkills(rs)
    })
  }

  const onSubmit = () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrmsg('')
    setPullRequest(task_id!, pullRequestURL, (s) => {
      if (s.name === 'tx') {
        setTX(s.tx!)
      } else if (s.title) {
        setProgress(s.title)
      }
    }).then((rs) => {
      setTask(rs)
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

  if (task) {
    infoAlert =
      <div className='pt-4'>
        <Alert
          color="info"
          icon={HiInformationCircle}
        >
          <span>
            <span className="font-medium">
              {'Task: '}
            </span>
            <a href={'/task/' + task.id}>{task.erc721_name + '#' + task.id}</a>
            <span className="font-medium">
              {' waitting 6s redirect ...'}
            </span>
          </span>
        </Alert>
      </div>
    setTimeout(() => {
      navigate('/task/pulls?task_id=' + task.id + '&owner=' + wallet.addr.toLocaleLowerCase())
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

  let loadingSkillsView = <></>

  if (loadingSkills) {
    loadingSkillsView = <div className='flex flex-row items-center justify-start gap-2'>
      <Spinner size="sm" style={{ lineHeight: "100%" }} color="success"></Spinner>
      <span className="text-sm">{t("Check ...")}</span>
    </div>
  } else if (skills && skills.length === 0) {
    loadingSkillsView = <div className='flex flex-row items-center justify-start gap-2 text-sm'>
      <HiBadgeCheck></HiBadgeCheck>
      <span className="text-sm">{t("Checked")}</span>
    </div >
  }

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl sm:p-4">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          {t('New Pull Request')}
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
                  htmlFor="skills"
                  value="Skills"
                />
              </div>
              {loadingSkillsView}
              <ul id="skills" className="divide-y divide-gray-200 dark:divide-gray-700">
                {
                  (skills || []).map((item) => (
                    <SkillIsGrant skill={item} owner={wallet.addr} key={item.id}></SkillIsGrant>
                  ))
                }
              </ul>
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="pullRequestURL"
                  value="Github Pull Request URL"
                />
              </div>
              <TextInput
                id="pullRequestURL"
                type="text"
                value={pullRequestURL}
                onChange={(e) => setPullRequestURL(e.currentTarget.value)}
                placeholder="https://github.com/:USERNAME/:REPO/pull/:PULL_ID"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loadingSpinner(true)}
              {t(loading ? progress : 'Submit')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default TaskPullCreate;
