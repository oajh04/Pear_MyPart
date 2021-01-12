import React, { useState, useEffect } from 'react';
import Header from '../Main/Header';
import * as S from '../styled/NoticeStyled/NoticeContentStyle';
import Leave from '../../assets/ArrowImg/Leave.png';
import link from '../../assets/link.svg';
import { Link } from 'react-router-dom';
import { request, fileRequest, FileURL } from '../../utils/axios/axios'


const NoticeContent = (props) => {

    const { params } = props.match;
    const ContentId = params.data;

    console.log(ContentId)

    const [ contentData, setContentData ] = useState(null);
    const [ fileData , setFileData] = useState(null);

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(null);

    useEffect(() => {
        const DataApi = async () => {
            try {
                // 요청이 시작 할 때에는 error 와 users 를 초기화하고
                setError(null);
                setContentData(null);
                // loading 상태를 true 로 바꿉니다.
                setLoading(true);
                const response = await request(
                "get",
                `/notice/${ContentId}`,
                {},
                "", 
                );
                console.log(response)
                setContentData(response.data);
                
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        };

        const FileApi = async () => {
            try{
                const response = await fileRequest(
                    "get",
                    `/notice/files/${ContentId}`,
                    {},
                    "",
                );
                setFileData(response.data);
                console.log(response.data)
            }catch(e){
                console.log(e)
            }
        }
    
        DataApi();
        FileApi()
      }, [ContentId]);

      const FileDownload = () => {
        window.open(FileURL + `/notice/${fileData[0].id}`);
      }

      if (loading) return <div>로딩중..</div>;
      if (error) return <div>{error}</div>;
      if (!contentData) return <div>보고서가 없습니다!</div>;

      const createTime = contentData.createdAt.split(" ")

    return(
        <>
                <S.Background>
                    <Header/>

                    <S.NoticeContant key={contentData.id}>
                        <S.NoticeHeader>
                            <S.NoLeave>
                                <Link to={'/notice?page=1'}>
                                    <img src={Leave} alt="사진"/>
                                </Link>
                            </S.NoLeave>

                            <S.NoTitle>
                                {contentData.title}
                            </S.NoTitle>

                            <S.NoDay>
                                {createTime[0]}
                            </S.NoDay>
                        </S.NoticeHeader>

                        <S.NoticeContain>
                            {contentData.description}
                        </S.NoticeContain>


                        <S.NoticeFile>
                            <S.FileLink>
                            <img onClick={FileDownload} src={link} alt="사진"/>
                            </S.FileLink>
                            <S.FileTitle>
                                <div onClick={FileDownload}>
                                    {contentData.fileName}
                                </div>
                            </S.FileTitle>
                        </S.NoticeFile>

                    </S.NoticeContant>
                </S.Background>
        </>
    )
}

export default NoticeContent;
