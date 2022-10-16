import { Alert, Button, Card, Spinner } from 'flowbite-react';
import { getErrmsg } from 'gudao-co-core/dist/error';
import { Page } from 'gudao-co-core/dist/page';
import { Project, queryProjects } from 'gudao-co-core/dist/project';
import { useTranslation } from "../i18n";
import { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import ProjList from '../view/ProjList';
import { useNavigate } from 'react-router-dom';
import useWallet from '../use/useWallet';

function Grants() {

  const [items, setItems] = useState<Project[]>()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<Page>()
  const [errmsg, setErrmsg] = useState('')
  const [wallet,] = useWallet()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const reloadData = (p: number) => {

    if (loading) {
      return
    }

    setLoading(true)

    queryProjects({ p: p, n: 20 }).then((rs) => {
      if (p === 1) {
        setItems(rs.items)
      } else {
        setItems((items || []).concat(rs.items))
      }
      setLoading(false)
      setPage(rs.page)
    }, (reason) => {
      setErrmsg(getErrmsg(reason))
      setLoading(false)
    })
  }


  if (items === undefined && !errmsg) {
    reloadData(1)
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

  let topLoadingSpinner = (light: boolean = true) => {
    return <></>
  }

  let bottomLoadingSpinner = (light: boolean = true) => {
    return <></>
  }

  if (loading) {

    if (!page || page.p === 1) {
      topLoadingSpinner = (light: boolean = true) => {
        return <div className='flex justify-center items-center mt-3'>
          <Spinner color="success" size="md" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
        </div>
      }
    } else {
      bottomLoadingSpinner = (light: boolean = true) => {
        return <div className='flex justify-end'>
          <Spinner color="success" size="md" light={light} style={{ lineHeight: "100%", marginRight: "6px" }} ></Spinner>
        </div>
      }
    }
  } else if (page && page.hasMore) {
    bottomLoadingSpinner = (light: boolean = true) => {
      return <div className='flex justify-end'>
        <Button
          color="light"
          pill={true}
          onClick={() => {
            let p = page.p + 1
            setPage({ p: p, n: page.n })
            reloadData(p)
          }}
        >
          {t('load more ...')}
        </Button>
      </div>
    }
  }

  let createProject = <></>

  if (wallet) {
    createProject = <Button
      onClick={() => navigate('/proj/create')}
    >
      {t('Create Project')}
    </Button>
  }

  return (
    <div className="container mx-auto max-w-xs sm:max-w-xl">
      <div className='flex justify-end pt-4 align-middle'>
        <div className='truncate font-medium text-3xl text-gray-900 dark:text-white flex-1 flex flex-row items-center'>
          <span className="hidden sm:flex">Grants&nbsp;</span><span>Projects</span>
        </div>
        {createProject}
      </div>
      {failureAlert}
      <div className='pt-4'>
        <Card>
          {topLoadingSpinner(true)}
          <ProjList items={items || []}></ProjList>
          {bottomLoadingSpinner(true)}
        </Card>
      </div>
    </div>
  );
}

export default Grants;
