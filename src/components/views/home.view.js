import style from './home.scss';
import { connect } from 'unistore';
import { actions } from '../../datastore';
import { Link } from 'preact-router/match';
import Fab from 'preact-material-components/Fab';
import 'preact-material-components/Fab/style.css';

import Images from '../images/images.component';

// svg
import add from "../../assets/svg/add.svg";

const HomeView = connect('token,environment', actions)(({ token, environment }) => (
  <div id="home-view" class={style.home} view="home">
    <Images pageSize="3" environment={environment} />
    {token && token.admin && (
      <Link href="/upload" class={style.fab}>
        <Fab>
          <img src={add} alt="add images"/>
        </Fab>
      </Link>
    )}
  </div>
));

export { HomeView };
