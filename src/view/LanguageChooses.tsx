import { Dropdown } from 'flowbite-react';
import { useRef, useState } from 'react';
import { Language, Languages, setLang, lang } from '../i18n';

function LanguageChooses() {

    const dropdown = useRef<HTMLDivElement>(null)
    const [current,setCurrent] = useState(lang)

    const setHidden = () => {
        if (dropdown.current) {
            dropdown.current.parentElement!.click()
        }
    };

    const onChooses = (item: Language) => {
        setLang(item)
        setHidden()
        setCurrent(item)
    }

    return (
        <div className='hidden sm:flex'>
            <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                    <span ref={dropdown} className='px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-400 dark:hover:text-white md:hover:text-blue-700 md:dark:hover:text-white'>{current.symbol}</span>
                }>
                {
                    Languages.map((item) => (
                        <Dropdown.Item key={item.name} onClick={() => { onChooses(item); }}>
                            <div className='flex flex-row flex-nowrap items-center'  >
                                <span className='mr-2 text-sm'>{item.title}</span>
                            </div>
                        </Dropdown.Item>
                    ))
                }
            </Dropdown>
        </div>
    );
}

export default LanguageChooses;
