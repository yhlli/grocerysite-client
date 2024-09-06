import {formatISO9075} from "date-fns"
import { address } from "./Header"
import { Link } from "react-router-dom"

export default function Post({_id,title,summary,cover,content,createdAt,author,uname}){

    return (
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={address+'/'+cover} alt="" />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p className="info">
            <Link to={`/user/${author.username}`} className="author">{author.username}</Link>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    )
}