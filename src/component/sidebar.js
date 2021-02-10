import React , {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome, faGraduationCap,faFileAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {fire} from '../firebase_config';
class Sidebar extends Component {
    constructor(props)
    {
        super(props);
        this.logout=this.logout.bind(this)
    }
    logout()
    {
        fire.auth().signOut();
    }
render(){
return(<div className="sidebar">
<ul>
<li><a href="/dashboard"><div className="initial text-white">AB</div></a></li>
<li><a href="/dashboard"><span><FontAwesomeIcon icon={faHome} /></span></a></li>
<li><a href="/classes"><span><FontAwesomeIcon icon={faGraduationCap} /></span></a></li>
<li><a href="/dashboard"><span><FontAwesomeIcon icon={faFileAlt} /></span></a></li>
<li><button className="btn" onClick={this.logout}><span><FontAwesomeIcon icon={faSignOutAlt} /></span></button></li>
</ul>
</div>)
}
}
export default Sidebar