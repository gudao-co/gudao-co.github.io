import { Navbar, Flowbite, DarkThemeToggle, Footer, Alert } from 'flowbite-react';
import logo512 from './image/logo512.png';
import { useTranslation } from "./i18n";
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import Home from './page/Home';
import Bounties from './page/Bounties';
import Ability from './page/Ability';
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

function App() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
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
      title: t('Ability'),
      href: '/ability'
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
          <div className='p-2 sm:p-0'></div>
        </Navbar.Collapse>
        <div className="flex items-center flex-nowrap">
          <div className='mr-1 hidden sm:flex'>
            <DarkThemeToggle />
            <LanguageChooses></LanguageChooses>
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
          <Route path="/ability" element={<Ability></Ability>}></Route>
          <Route path="/proj">
            <Route path="create" element={<ProjCreate></ProjCreate>}> </Route>
            <Route path="deposit" element={<ProjDeposit></ProjDeposit>}></Route>
            <Route path="tasks" element={<ProjTasks></ProjTasks>}></Route>
            <Route path=":id" element={<Proj></Proj>}> </Route>
          </Route>
          <Route path="task">
            <Route path="create" element={<TaskCreate></TaskCreate>}> </Route>
            <Route path="deposit" element={<TaskDeposit></TaskDeposit>}></Route>
            <Route path=":id" element={<TaskPage></TaskPage>}> </Route>
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
    </Flowbite >
  );
}

export default App;
