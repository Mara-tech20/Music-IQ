import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';

const TIME_PER_QUESTION = 15;
const PASS_THRESHOLD = 4; // Need 4 out of 4 correct to win level

export default function GameplayView() {
  const { session, getLevelQuestions, recordAnswer, showModal, markUsedIndices, playSFX } = useGame();
  const category = CATEGORIES[session.category];

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAns, setSelectedAns] = useState(null);
  const [ansState, setAnsState] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [levelScore, setLevelScore] = useState(0); // correct answers this level
  const [showXP, setShowXP] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Load questions when component mounts or level advances
    const qList = getLevelQuestions();
    if (qList.length < 4) {
      showModal('lose'); // Not enough questions, game over
      return;
    }
    setQuestions(qList);
    setCurrentIdx(0);
    setLevelScore(0);
    setSelectedAns(null);
    setAnsState(null);
    setTimeLeft(TIME_PER_QUESTION);
  }, [session.currentLevel, session.levelAttempt]); // eslint-disable-line

  useEffect(() => {
    // Timer logic
    if (selectedAns !== null || ansState !== null || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [selectedAns, ansState, questions, currentIdx]);

  const handleTimeOut = () => {
    setToast("⏰ Time's up!");
    recordAnswer(false, true);
    playSFX('wrong');
    nextQuestion(false);
  };

  const handleSelect = (idx) => {
    if (selectedAns !== null || ansState !== null) return;
    
    clearInterval(timerRef.current);
    setSelectedAns(idx);
    
    const q = questions[currentIdx];
    const isCorrect = idx === q.correctIndex;
    
    setAnsState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setLevelScore(prev => prev + 1);
      playSFX('correct');
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
    } else {
      playSFX('wrong');
    }
    
    recordAnswer(isCorrect, false);

    timeoutRef.current = setTimeout(() => {
      nextQuestion(isCorrect);
    }, 2000);
  };

  const nextQuestion = (wasCorrect) => {
    if (currentIdx + 1 >= questions.length) {
      // Level over
      markUsedIndices(questions.map(q => q.originalIndex));
      
      const finalScoreThisLevel = levelScore + (wasCorrect ? 1 : 0);

      // Save XP earned this level to session state to display in fail/win modals
      // (This is implicitly tracked in GameContext's session.xpEarned, but let's rely on the modals to use it)

      if (finalScoreThisLevel >= PASS_THRESHOLD) {
        showModal('win');
      } else {
        showModal('lose');
      }
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setAnsState(null);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!questions.length) return null;

  const currentQ = questions[currentIdx];
  const progressPercent = ((currentIdx) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100%',
      padding: '24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: category.gameGradient,
      animation: 'fadeIn 0.5s ease',
      position: 'relative',
      borderRadius: 'var(--r-lg)',
      margin: '0 24px 24px',
      boxShadow: `inset 0 0 100px ${category.glow}`,
      overflow: 'hidden'
    }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.95)', color: '#fff',
          padding: '12px 24px', borderRadius: 'var(--r-full)',
          boxShadow: '0 4px 20px rgba(239,68,68,0.4)', zIndex: 1000,
          animation: 'toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          fontWeight: 700, pointerEvents: 'none', fontSize: '1.05rem',
          display: 'flex', alignItems: 'center', gap: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          {toast}
        </div>
      )}
      
      {/* Background Icon */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '400px', opacity: 0.05,
        filter: 'blur(10px)', pointerEvents: 'none'
      }}>
        {category.emoji}
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px' }}>
        {/* Header stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: 'var(--r-full)', backdropFilter: 'blur(10px)' }}>
            Level {session.currentLevel}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 'bold',
              border: `4px solid ${timeLeft <= 5 ? 'var(--red)' : category.timerColor}`,
              color: timeLeft <= 5 ? 'var(--red)' : '#fff',
              animation: timeLeft <= 5 ? 'timerPulseRed 1s infinite, timerUrgent 1s infinite' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {timeLeft}
            </div>
            
            <style>{`
              @keyframes floatingXP {
                0% { opacity: 0; transform: translate(-50%, 0) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -15px) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -25px) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -35px) scale(0.9); }
              }
            `}</style>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: 'var(--r-full)', backdropFilter: 'blur(10px)' }}>
            Score: {session.score}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', background: category.barColor, 
            width: `${progressPercent}%`, transition: 'width 0.4s ease'
          }}></div>
        </div>

        {/* Question Area (Card Swipe Animation Wrapper) */}
        <div key={currentIdx} style={{ animation: 'cardSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.9rem', color: category.colorB, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
              Question {currentIdx + 1} of {questions.length}
            </div>
            <h2 style={{ fontSize: '2rem', lineHeight: 1.4 }}>{currentQ.question}</h2>
          </div>

          {/* Answers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {currentQ.answers.map((ans, idx) => {
              let bg = 'var(--bg-card)';
              let borderColor = 'var(--border)';
              let animation = 'none';

              if (ansState !== null) {
                if (idx === currentQ.correctIndex) {
                  bg = 'rgba(16,185,129,0.2)';
                  borderColor = 'var(--green)';
                  animation = ansState === 'correct' && selectedAns === idx ? 'correctPulse 1s' : 'none';
                } else if (idx === selectedAns) {
                  bg = 'rgba(239,68,68,0.2)';
                  borderColor = 'var(--red)';
                  animation = 'wrongShake 0.5s';
                } else {
                  bg = 'rgba(255,255,255,0.02)';
                  borderColor = 'transparent';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={ansState !== null}
                  onClick={() => handleSelect(idx)}
                  style={{
                    position: 'relative',
                    padding: '24px', fontSize: '1.1rem', borderRadius: 'var(--r-md)',
                    background: bg, border: `2px solid ${borderColor}`,
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px',
                    transition: 'all 0.2s', cursor: ansState !== null ? 'default' : 'pointer',
                    animation: animation,
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => { if(ansState === null) { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                  onMouseOut={(e) => { if(ansState === null) { e.currentTarget.style.background = bg; e.currentTarget.style.transform = 'translateY(0)'; } }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', color: 'var(--text-secondary)'
                  }}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </div>
                  <span style={{ flex: 1 }}>{ans}</span>
                  
                  {/* Floating XP Animation */}
                  {showXP && selectedAns === idx && idx === currentQ.correctIndex && (
                    <div style={{
                      position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                      color: 'var(--green)', fontWeight: 'bold', fontSize: '1.3rem',
                      textShadow: '0 2px 6px rgba(0,0,0,0.5)', pointerEvents: 'none',
                      animation: 'floatingXP 1.5s ease-out forwards', whiteSpace: 'nowrap',
                      zIndex: 10
                    }}>
                      +10 XP
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {ansState === 'timeout' && (
          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--red)', fontSize: '1.2rem', animation: 'fadeIn 0.3s' }}>
            Time's up! Moving to next question...
          </div>
        )}
        
        {ansState === 'wrong' && (
          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--red)', fontSize: '1.2rem', animation: 'fadeIn 0.3s' }}>
            Incorrect! Moving to next question...
          </div>
        )}
      </div>
    </div>
  );
}
