import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from 'components/Layout';

const ReviewContainer = styled.div`
  margin-bottom: 15rem;
`;
const ReviewHead = styled.div`
  color: ${(props) => props.theme.accent};
`;
const WantAgainWrap = styled.div`
  margin-bottom: 2rem;
`;
const WantAgainContent = styled.div``;
const WantAgainHead = styled.div`
  margin-top: 1.5rem;
  font-size: 1.4rem;
  font-weight: 700;
`;
const ProgSurveyWrap = styled.div`
  margin-top: 15px;
  font-size: 1rem;
  padding-bottom: 10px;
  line-height: 150%;
`;
const ReviewBtnWrap = styled.div`
  margin-top: 20px;
  float: right;
`;
const CreateBtn = styled.button`
  border-radius: 5px;
  border: none;
  padding: 0.8rem 1rem;
  background-color: ${(props) => props.theme.accent};
  color: white;
  font-weight: 600;
`;
const MemberRowWapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const MemberNickName = styled.div``;

export default function ReviewCreate() {
  const URL = process.env.REACT_APP_DEV_URL;
  const { programId, applyId } = useParams();
  const [members, setMembers] = useState<any>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [goodMembers, setGoodMembers] = useState(new Set()); // 체크된 항목
  const [badMember, setBadMember] = useState<number>();
  const [score, setScore] = useState<number>(0);
  const [writerInfo, setWriterInfo] = useState<any>({});

  const surveyScoreList = [
    { content: '매우 만족', score: 2 },
    { content: '만족', score: 1 },
    { content: '보통', score: 0 },
    { content: '불만족', score: -1 },
    { content: '매우 불만족', score: -2 },
  ];

  const getProgramApplyList = async () => {
    await axios
      .get(`${URL}/api/applies?page=1&size=4&programId=${programId}`)
      .then((res) => {
        setMembers(res.data.data);
      });
  };
  const getProgramWriter = async () => {
    await axios.get(`${URL}/api/programs/${programId}`).then(({ data }) => {
      setWriterInfo({
        id: data?.writer?.id,
        nickname: data?.writer?.nickname,
      });
    });
  };

  useEffect(() => {
    getProgramApplyList();
    getProgramWriter();
  }, []);

  const reviewBody = {
    applyId: Number(applyId),
    likes: goodMembers?.size !== 0 ? Array.from(goodMembers) : '',
    hate: badMember,
    score: score,
  };

  console.log('바디', reviewBody);

  const handleReviewSubmit = async () => {
    await axios
      .post(`${URL}/api/reviews`, reviewBody)
      .then((res) => console.log(res));
  };

  const handleCheckedBox = (e: any) => {
    setIsChecked(!isChecked);
    handlecheckedItem(e.target.parentNode, e.target.value, e.target.checked);
  };

  const handlecheckedItem = (box: any, id: number, isChecked: any) => {
    if (isChecked) {
      id = Number(id);
      goodMembers.add(id);
      setGoodMembers(goodMembers);
      box.style.color = '#ff5924';
    }
    if (!isChecked && goodMembers.has(Number(id))) {
      id = Number(id);
      goodMembers.delete(id);
      setGoodMembers(goodMembers);
      box.style.color = 'black';
    }
    return goodMembers;
  };

  const handleCheckBadMember = (target: any) => {
    const checkBadMember = document.getElementsByName('onlyCheckedBad');
    if (checkBadMember) {
      checkBadMember.forEach((item: any) => {
        item.checked = false;
      });
      target.checked = true;
      setBadMember(Number(target.value));
    }
  };

  const handleCheckScore = (target: any) => {
    const checkScore = document.getElementsByName('onlyCheckedScore');
    if (checkScore) {
      checkScore.forEach((item: any) => {
        item.checked = false;
      });
      target.checked = true;
      setScore(Number(target.value));
      console.log(Number(target.value));
    }
  };

  return (
    <Layout>
      <ReviewContainer>
        <ReviewHead>* 는 필수로 요구되는 사항입니다</ReviewHead>
        <WantAgainWrap>
          <WantAgainContent>
            <WantAgainHead>
              다시 함께하고 싶은 멤버 (복수 선택 가능)
            </WantAgainHead>
            <ProgSurveyWrap>
              {members &&
                members.map((el: any) => (
                  <MemberRowWapper key={el?.id}>
                    <MemberNickName>
                      <label htmlFor={el?.user?.id}>
                        <input
                          type="checkbox"
                          id={el?.user?.id}
                          value={el?.user?.id}
                          onChange={(e) => handleCheckedBox(e)}
                        />
                        &nbsp; {el?.user?.nickname}
                      </label>
                    </MemberNickName>
                    <MemberNickName>
                      <label htmlFor={writerInfo?.id}>
                        <input
                          type="checkbox"
                          id={writerInfo?.id}
                          value={writerInfo?.id}
                          onChange={(e) => handleCheckedBox(e)}
                        />
                        &nbsp; {writerInfo && writerInfo?.nickname}
                      </label>
                    </MemberNickName>
                  </MemberRowWapper>
                ))}
            </ProgSurveyWrap>
          </WantAgainContent>
          <WantAgainContent>
            <WantAgainHead>다신 함께하고 싶지 않은 멤버</WantAgainHead>
            <ProgSurveyWrap>
              {members &&
                members.map((el: any) => (
                  <MemberRowWapper key={el?.id}>
                    <MemberNickName>
                      <label>
                        <input
                          type="checkbox"
                          name="onlyCheckedBad"
                          id={el?.id}
                          value={el?.user?.id}
                          onChange={(e) => handleCheckBadMember(e.target)}
                        />
                        &nbsp; {el?.user?.nickname}
                      </label>
                    </MemberNickName>
                    <MemberNickName>
                      <label>
                        <input
                          type="checkbox"
                          name="onlyCheckedBad"
                          id={writerInfo?.id}
                          value={writerInfo?.id}
                          onChange={(e) => handleCheckBadMember(e.target)}
                        />
                        &nbsp; {writerInfo && writerInfo?.nickname}
                      </label>
                    </MemberNickName>
                  </MemberRowWapper>
                ))}
            </ProgSurveyWrap>
          </WantAgainContent>
          <WantAgainContent>
            <WantAgainHead>이 프로그램은 어땠나요? *</WantAgainHead>
            <ProgSurveyWrap>
              {surveyScoreList &&
                surveyScoreList.map((el: any, idx: number) => (
                  <MemberRowWapper key={idx}>
                    <MemberNickName>
                      <label>
                        <input
                          type="checkbox"
                          name="onlyCheckedScore"
                          id={String(idx)}
                          value={el.score}
                          onChange={(e) => handleCheckScore(e.target)}
                        />
                        &nbsp; {el.content}
                      </label>
                    </MemberNickName>
                  </MemberRowWapper>
                ))}
            </ProgSurveyWrap>
          </WantAgainContent>
        </WantAgainWrap>
        <ReviewBtnWrap>
          <CreateBtn onClick={handleReviewSubmit}>작성완료</CreateBtn>
        </ReviewBtnWrap>
      </ReviewContainer>
    </Layout>
  );
}
