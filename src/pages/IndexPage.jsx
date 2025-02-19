import { useEffect, useState } from "react";
import Post from "../Post";
import { address } from "../Header";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../Loading";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);

    //var [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    //const [showNews, setShowNews] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = parseInt(searchParams.get('sort') || '1', 10);
    const showNews = searchParams.get('showNews') === 'true';

    //1:date desc, 2:date asc, 3:views desc, 4:views asc
    //const [sortBy, setsortBy] = useState(1);
    const sortCriteria = {
        1: "Date descending",
        2: "Date ascending",
        3: "Views descending",
        4: "Views ascending",
    };

    useEffect(()=>{
        setIsLoading(true);
        fetch(address+'/post?page='+currentPage+'&sort='+sortBy+'&showNews='+showNews).then(response=>{
            response.json().then(posts=>{
                setPosts(posts.data);
                setTotalPages(Math.ceil(posts.totalCount/20));
            })
            .catch(err=>console.log(err));
            setIsLoading(false);
        });
    },[currentPage,sortBy,showNews]);

    const updateQueryParams = (page, sort, news) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        params.set('sort', sort);
        params.set('showNews', news);
        setSearchParams(params);
    }

    const firstPage = () => {
        updateQueryParams(1, sortBy, showNews);
    }
    const nextPage = () => {
        updateQueryParams(currentPage + 1, sortBy, showNews);
    }
    const lastPage = () => {
        updateQueryParams(totalPages, sortBy, showNews);
    }
    const prevPage = () => {
        updateQueryParams(currentPage - 1, sortBy, showNews);
    }

    const handleChangeSort = (sort) => {
        updateQueryParams(1, sort, showNews);
    }

    const handleToggle = () => {
        updateQueryParams(1, sortBy, !showNews);
    }

    return(
        <>
            {isLoading ? <Loading /> : (
                <>
                <div id="sortdiv">
                    <li className="sort"><Link>Sort By</Link>
                        <ul>
                            <li><button onClick={()=>handleChangeSort(1)}>Date desc.</button></li>
                            <li><button onClick={()=>handleChangeSort(2)}>Date asc.</button></li>
                            <li><button onClick={()=>handleChangeSort(3)}>Views desc.</button></li>
                            <li><button onClick={()=>handleChangeSort(4)}>Views asc.</button></li>
                        </ul>
                    </li>
                    <p>{sortCriteria[sortBy]}</p>
                    <button className={`newsButton ${showNews ? 'active' : ''}`} onClick={handleToggle}>
                        {showNews ? 'Hide News' : 'Show News'}
                    </button>
                </div>
                
                {posts.length > 0 && posts.map(post => (
                    <Post key={post._id} {...post} />
                ))}
                <div className="pagination">
                    {currentPage>1 && (
                        <>
                            <button onClick={firstPage}>First</button>
                            <button onClick={prevPage}>Prev</button>
                        </>
                    )}
                    <div>{currentPage}</div>
                    {currentPage<totalPages && (
                        <>
                            <button onClick={nextPage}>Next</button>
                            <button onClick={lastPage}>Last</button>
                        </>
                    )}
                </div>
                </>
            )}
        </>
    );
}