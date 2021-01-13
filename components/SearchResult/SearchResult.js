import React, {useState, useEffect} from 'react';
import * as S from '../styled/SearchResult/SearchResultStyle';
import SearchResultTitle from './SearchResultTitle';
import SearchResultProfile from './SearchResultProfile';
import Header from '../Main/Header';
import {LeftArrow, RightArrow} from '../../assets/ArrowImg/index';
import queryString from 'query-string';
import { request } from '../../utils/axios/axios';
import { Link } from 'react-router-dom';

const SearchResult = ({location}) => {
    const query = queryString.parse(location.search);
    console.log(query);

    const [ searchData, setSearchData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(null);

    /* page 설정 */
    const [ page, setPage ] = useState(5);
    const [ nowPage, setNowPage ] = useState(1);
    const [ basicsPage, setBasicPage ] = useState(1);
    const [ EndPage, setEndPage ] = useState(5);
    let page_arr = [];

    useEffect(()=>{
        const DataApi = async () => {
            setLoading(true);
            try{
                setError(null);
                setSearchData(null);
                const access = localStorage.getItem('access')
                const response = await request(
                    "get",
                    `/search/${query.mode}?keyword=${query.keyword}&size=7&page=${nowPage-1}`,
                    {},
                    "",
                );
                setSearchData(response.data);
                setEndPage(response.data.totalPages);
            } catch(e) {
                //setError(e);
            }
    
            setLoading(false);
        }

        DataApi();
    }, [nowPage, query.mode, query.keyword]);
    console.log(query.mode)

    const mode = () => {

        switch(query.mode){
            case "profile" :
                console.log("1")
                return(
                    <SearchResultProfile data={searchData}/>
                )
            case "report" :
                console.log("2")
                return(
                    <SearchResultTitle data={searchData}/>
                )
            default : 
                return(
                    <div>없는 타입</div>
                )
        }
    }

    /* api 연동되면 수정할 것들 */

        if(EndPage < 5){
            for(let i = basicsPage; i <= EndPage; i++) {
                page_arr[i] = i;
            }
        }
        else{
            for(let i = basicsPage; i <= page; i++) {
            page_arr[i]=i;
            }
        }


    const processed = (querys) => page_arr.map((num)=>{
        if(Number(querys.page) !== num){
            return <Link onClick={()=>setNowPage(num)} to={`search-result?mode=${query.mode}&keyword=${query.keyword}&page=${num}`} key={num}> {page_arr[num]} </Link>
        }
        else {
            return <Link onClick={()=>setNowPage(num)} to={`search-result?mode=${query.mode}&keyword=${query.keyword}&page=${num}`} style={{color: "#6192f3"}} key={num}> {page_arr[num]} </Link>
        }
    });
    
    const prev = () => {
        if(basicsPage!==1){
            if(page%5 !== 0){
                setPage(page-page%5)
                setBasicPage(basicsPage-basicsPage%5-4)
            }else{
                setPage(page-5)
                setBasicPage(basicsPage-5)
            }   
        }
    }

    const next = () => {
        if(page < EndPage){
            if(EndPage < page + 5){
                setPage(EndPage)
                setBasicPage(basicsPage+5);
            }
            else {
                setPage(page+5);
                setBasicPage(basicsPage+5);
            }
        }
    }

    if (error) return <div>{error}</div>;
    if (loading) return <div>Loading...</div>;
    if(!searchData) return <div>검색결과가 없습니다</div>
    
    return(
        <>
            <S.Background>
            <Header/>
            
                <S.ResultBox>
                    <S.ResultSubBox>

                        <S.ResultChoice>
                            <S.ResultKeyword>
                                <span>{query.keyword}</span> 에 대한 검색결과입니다.
                            </S.ResultKeyword>
                            <S.ResultPage>
                                총 {EndPage}페이지 중 {query.page} 페이지 입니다
                            </S.ResultPage>
                        </S.ResultChoice>

                        <S.ResultContant>

                            {
                                mode()
                            }

                        </S.ResultContant>

                        <S.ResultAdd>
                            <S.ResultAddNumber>
                                    <img src={LeftArrow} alt="사진" onClick={prev}/>
                                    {
                                        processed(query)
                                    }
                                    <img src={RightArrow} alt="사진" onClick={next}/>
                            </S.ResultAddNumber>
                        </S.ResultAdd>
                        
                    </S.ResultSubBox>
                </S.ResultBox>
            </S.Background>
        </>
    )
}

export default SearchResult;