import { sections } from "@/app/utils/constants";
import NavLink from "@/app/components/navbar/nav-link";
import { FC } from "react";
import { RxHamburgerMenu } from "react-icons/rx";


const Navbar:FC = () => {
  return (
    <nav  className="min-h-screen min-w-[60px] border-r border-zinc-300">
      <div className="navbar flex flex-col gap-5 text-gray-500 fixed bg-white h-screen z-50">
        <button className="grid place-items-center pt-5 text-2xl">
          <input id="menu" type="checkbox" />

          <label htmlFor="menu">
            <RxHamburgerMenu />
          </label>
        </button>

        <div>
          {sections.map((i,key)=> <NavLink  item={i} key={key}/>)}
        </div>

      </div>
    </nav>
  )
};

export default Navbar;
