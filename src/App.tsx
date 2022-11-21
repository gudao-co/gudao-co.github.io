import { Navbar, Flowbite, DarkThemeToggle, Footer, Alert, Toast } from 'flowbite-react';
import logo512 from './image/logo512.png';
import { useTranslation } from "./i18n";
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import Home from './page/Home';
import Bounties from './page/Bounties';
import WalletConnect from './view/WalletConnect';
import Grants from './page/Grants';
import WalletChooses from './view/WalletChooses';
import ProjCreate from './page/proj/ProjCreate';
import Proj from './page/proj/Proj';
import ProjDeposit from './page/proj/ProjDeposit';
import { HiOutlineMail } from 'react-icons/hi';
import { TbBrandTelegram } from 'react-icons/tb';
import LanguageChooses from './view/LanguageChooses';
import useAlert from './use/useAlert';
import TaskCreate from './page/task/TaskCreate';
import TaskPage from './page/task/Task';
import TaskDeposit from './page/task/TaskDeposit';
import ProjTasks from './page/proj/ProjTasks';
import Skills from './page/Skills';
import SkillPage from './page/skill/Skill';
import SkillCreate from './page/skill/SkillCreate';
import SkillDeposit from './page/skill/SkillDeposit';
import SkillWithdraw from './page/skill/SkillWithdraw';
import SkillGrant from './page/skill/SkillGrant';
import useToast from './use/useToast';
import SkillFeeRate from './page/skill/SkillFeeRate';
import SkillGrants from './page/skill/SkillGrants';
import SkillUnGrant from './page/skill/SkillUnGrant';
import TaskPullCreate from './page/task/TaskPullCreate';
import TaskPulls from './page/task/TaskPulls';
import NetworkChooses from './view/NetworkChooses';

function App() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const [toast, setToast] = useToast();

  const items: { title: string, href: string }[] = [
    {
      title: t('Home'),
      href: '/'
    },
    {
      title: t('Grants'),
      href: '/grants'
    },
    {
      title: t('Bounties'),
      href: '/bounties'
    },
    {
      title: t('Skills'),
      href: '/skills'
    }
  ];

  let alertView = <></>

  if (alert) {
    let currAlert = alert
    alertView =
      <div className='pb-4'>
        <Alert
          color={alert.color}
          icon={alert.icon}
        >
          {alert.title}
        </Alert>
      </div>
    if (alert.duration) {
      setTimeout(() => {
        if (currAlert === alert) {
          setAlert(undefined)
        }
      }, alert.duration)
    }
  }

  let toastView = <></>

  if (toast) {
    let currToast = toast
    toastView = <div className='fixed right-8 top-16'>
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          {toast.icon}
        </div>
        <div className="ml-3 text-sm font-normal">
          {toast.body}
        </div>
        <Toast.Toggle />
      </Toast>
    </div>
    if (toast.duration) {
      setTimeout(() => {
        if (currToast === toast) {
          setToast(undefined)
        }
      }, toast.duration)
    }
  }


  return (
    <Flowbite theme={{
      theme: {
        alert: {
          color: {
            primary: 'bg-primary'
          }
        },
        minWidth: {
          '1/2': '50%'
        },
      }
    }} className="min-h-screen">
      <Navbar
        fluid={true}
        rounded={true}
      >
        <Navbar.Toggle />
        <Navbar.Brand href="https://gudao.co/" style={{ minWidth: "fit-content" }}>
          <img
            src={logo512}
            className="mr-3 h-6 sm:h-7"
            alt="GUDAO.CO"
          />
          <span className="self-center whitespace-nowrap text-sl sm:text-xl font-semibold dark:text-white mr-3 min-w-fit">
            GUDAO.CO
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          {
            items.map((item) => (
              <Navbar.Link onClick={() => { navigate(item.href) }} style={{ "cursor": "pointer" }} key={item.href}>
                {item.title}
              </Navbar.Link>
            ))
          }
          <NetworkChooses className='sm:hidden pl-3'></NetworkChooses>
          <LanguageChooses className='sm:hidden'></LanguageChooses>
          <div className='p-2 sm:p-0'></div>
        </Navbar.Collapse>
        <div className="flex items-center flex-nowrap">
          <DarkThemeToggle />
          <div className='mr-1 hidden sm:flex'>
            <LanguageChooses className='hidden sm:flex'></LanguageChooses>
          </div>
          <WalletConnect></WalletConnect>
        </div>
      </Navbar>
      <div className='py-4 flex-1'>
        {alertView}
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/bounties" element={<Bounties></Bounties>}> </Route>
          <Route path="/grants" element={<Grants></Grants>}></Route>
          <Route path="/skills" element={<Skills></Skills>}></Route>
          <Route path="/proj">
            <Route path="create" element={<ProjCreate></ProjCreate>}> </Route>
            <Route path="deposit" element={<ProjDeposit></ProjDeposit>}></Route>
            <Route path="tasks" element={<ProjTasks></ProjTasks>}></Route>
            <Route path=":id" element={<Proj></Proj>}> </Route>
          </Route>
          <Route path="task">
            <Route path="create" element={<TaskCreate></TaskCreate>}> </Route>
            <Route path="deposit" element={<TaskDeposit></TaskDeposit>}></Route>
            <Route path="pull/create" element={<TaskPullCreate></TaskPullCreate>}></Route>
            <Route path="pulls" element={<TaskPulls></TaskPulls>}></Route>
            <Route path=":id" element={<TaskPage></TaskPage>}> </Route>
          </Route>
          <Route path="skill">
            <Route path="create" element={<SkillCreate></SkillCreate>}> </Route>
            <Route path="deposit" element={<SkillDeposit></SkillDeposit>}></Route>
            <Route path="withdraw" element={<SkillWithdraw></SkillWithdraw>}></Route>
            <Route path="grant" element={<SkillGrant></SkillGrant>}></Route>
            <Route path="ungrant" element={<SkillUnGrant></SkillUnGrant>}></Route>
            <Route path="grants" element={<SkillGrants></SkillGrants>}></Route>
            <Route path="feerate" element={<SkillFeeRate></SkillFeeRate>}></Route>
            <Route path=":id" element={<SkillPage></SkillPage>}> </Route>
          </Route>
        </Routes>
      </div>
      <Footer container={true}>
        <Footer.Copyright
          href="#"
          by="GUDAO.CO™"
          year={2022}
        />
        <Footer.LinkGroup>
          <Footer.Icon href="https://t.me/gudao_co" target="_blank" icon={TbBrandTelegram}></Footer.Icon>
          <span className='px-2'></span>
          <Footer.Icon href="mailto:info@gudao.co" target="_blank" icon={HiOutlineMail}></Footer.Icon>
        </Footer.LinkGroup>
      </Footer>
      <WalletChooses></WalletChooses>
      {toastView}
    </Flowbite >
  );
}

export default App;
