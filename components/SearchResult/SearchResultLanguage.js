import React, { useCallback, useEffect, useState } from 'react';
import * as S from '../styled/SearchResult/SearchResultStyle';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const SearchResultLanguage = (props) => {
    const LanguageData = props.data;

    const history = useHistory()

    const onLink = () => {
        history.push(`/view-report/main-report`)
    }

    const SearchLanguage = useCallback(
        (dataList) => {
            return dataList.map((data)=>{
                const color = data.bdc === "팀" ? "#6192f3" : data.bdc === "개인" ? "#27d5b1" : "#5955d8";
                return(
                    <div key={data.id}>
                        <S.Container bordercolor={color} >
                            <S.ContainerContant>
                                <S.ContainerBDC fontcolor={color}>
                                    [{data.bdc}]
                                </S.ContainerBDC>
                                <S.ContainerTitle>
                                    {data.username}
                                </S.ContainerTitle>
                                <S.ContainerDay>
                                    {data.day}
                                </S.ContainerDay>
                            </S.ContainerContant>
                        </S.Container>
                    </div>
                )
            })
        }
    ,[]);

    

    return (
        <>
            {
                SearchLanguage(LanguageData)
            }
        </>
    )
}

export default SearchResultLanguage;
