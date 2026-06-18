import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/questions';
import { useIsMobile } from '../hooks/useIsMobile';

const TIME_PER_QUESTION = 15;
const PASS_THRESHOLD = 4; // Need 4 out of 4 correct to win level

export default function GameplayView() {
  const { session, player, getLevelQuestions, recordAnswer, showModal, markUsedIndices, playSFX, markPlayedToday, updateSetting } = useGame();
  const category = CATEGORIES[session.category];
  const isMobile = useIsMobile();

  useEffect(() => {
    markPlayedToday();
  }, [markPlayedToday]);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAns, setSelectedAns] = useState(null);
  const [ansState, setAnsState] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [levelScore, setLevelScore] = useState(0); // correct answers this level
  const [showXP, setShowXP] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [toast, setToast] = useState(null);
  const [levelIntro, setLevelIntro] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const levelRef = useRef(session.currentLevel);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Level intro transition trigger
  useEffect(() => {
    if (session.currentLevel > levelRef.current && session.currentLevel > 1) {
      setLevelIntro(true);
      setCountdown(2);
      playSFX('click');
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setLevelIntro(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      levelRef.current = session.currentLevel;
      return () => clearInterval(interval);
    } else {
      levelRef.current = session.currentLevel;
    }
  }, [session.currentLevel, playSFX]);

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
    if (selectedAns !== null || ansState !== null || questions.length === 0 || levelIntro) return;

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
  }, [selectedAns, ansState, questions, currentIdx, levelIntro]);

  const handleTimeOut = () => {
    setToast("⏰ Time's up!");
    recordAnswer(false, true);
    playSFX('wrong');
    setXpGained(2);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1500);
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
      setXpGained(10);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
    } else {
      playSFX('wrong');
      setXpGained(2);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
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

  if (levelIntro) {
    const introProgress = ((2 - countdown) / 2) * 100;
    return (
      <div style={{
        minHeight: '480px', width: '100%', maxWidth: '800px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px',
        animation: 'fadeIn 0.4s ease', margin: '0 auto', color: '#fff', textAlign: 'center',
      }}>
        {/* Spinner ring */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          border: `5px solid rgba(255,255,255,0.1)`,
          borderTopColor: category.timerColor,
          animation: 'spin 0.9s linear infinite',
        }} />

        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em' }}>
            Loading Level {session.currentLevel}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${introProgress}%`, background: category.timerColor, transition: 'width 1s linear', borderRadius: 'var(--r-full)' }} />
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;
  const progressPercent = ((currentIdx) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100%',
      padding: isMobile ? '24px 12px' : '24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: category.gameGradient,
      animation: 'fadeIn 0.5s ease',
      position: 'relative',
      borderRadius: 'var(--r-lg)',
      margin: isMobile ? '0 4px 16px' : '0 24px 24px',
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
        <div style={{
          display: 'flex', alignItems: 'center',
          position: 'relative',
          marginBottom: isMobile ? '12px' : '24px',
        }}>
          {/* Left: Level */}
          <div style={{ flex: 1 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: 'var(--r-full)', backdropFilter: 'blur(10px)', display: 'inline-block' }}>
              Level {session.currentLevel}
            </div>
          </div>

          {/* Center: Timer — absolutely centered so neither side can push it off */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: timeLeft <= 5 ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 900,
                border: `4px solid ${timeLeft <= 5 ? 'var(--red)' : category.timerColor}`,
                color: timeLeft <= 5 ? 'var(--red)' : '#ffffff',
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                animation: timeLeft <= 5 ? 'timerPulseRed 1s infinite, timerUrgent 1s infinite' : 'none',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 0 2px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)`
              }}>
                {timeLeft}
              </div>
              {showXP && selectedAns === null && (
                <div style={{
                  position: 'absolute', top: '-30px', left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.3rem',
                  textShadow: '0 2px 6px rgba(0,0,0,0.5)', pointerEvents: 'none',
                  animation: 'floatingXP 1.5s ease-out forwards', whiteSpace: 'nowrap', zIndex: 10,
                }}>
                  +{xpGained} ⭐
                </div>
              )}
              <style>{`
                @keyframes floatingXP {
                  0% { opacity: 0; transform: translate(-50%, 0) scale(0.8); }
                  20% { opacity: 1; transform: translate(-50%, -15px) scale(1.1); }
                  80% { opacity: 1; transform: translate(-50%, -25px) scale(1); }
                  100% { opacity: 0; transform: translate(-50%, -35px) scale(0.9); }
                }
              `}</style>
            </div>
          </div>

          {/* Right: Score + Speaker */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: 'var(--r-full)', backdropFilter: 'blur(10px)' }}>
              Score: {session.score}
            </div>
            <button
              type="button"
              onClick={() => updateSetting('music', !player.settings.music)}
              title={player.settings.music ? 'Mute music' : 'Play music'}
              style={{
                background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '38px', height: '38px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              {player.settings.music ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: isMobile ? '20px' : '40px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', background: category.barColor, 
            width: `${progressPercent}%`, transition: 'width 0.4s ease'
          }}></div>
        </div>

        {/* Question Area (Card Swipe Animation Wrapper) */}
        <div key={currentIdx} style={{ animation: 'cardSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div className="glass-card" style={{ padding: isMobile ? '28px 18px' : '40px', textAlign: 'center', marginBottom: isMobile ? '20px' : '32px' }}>
            <div style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', color: category.colorB, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: isMobile ? '14px' : '16px' }}>
              Question {currentIdx + 1} of {questions.length}
            </div>
            <h2 style={{ fontSize: isMobile ? '1.35rem' : '2rem', lineHeight: 1.5 }}>{currentQ.question}</h2>
          </div>

          {/* Answers */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? '12px' : '16px' }}>
            {currentQ.answers.map((ans, idx) => {
              let bg = 'rgba(0,0,0,0.45)';
              let borderColor = 'rgba(255,255,255,0.25)';
              let textColor = '#ffffff';
              let animation = 'none';
              let boxShadow = '0 2px 12px rgba(0,0,0,0.3)';

              if (ansState !== null) {
                if (idx === currentQ.correctIndex) {
                  bg = 'rgba(16,185,129,0.35)';
                  borderColor = 'var(--green)';
                  textColor = '#ffffff';
                  boxShadow = `0 4px 20px rgba(16,185,129,0.4)`;
                  animation = ansState === 'correct' && selectedAns === idx ? 'correctPulse 1s' : 'none';
                } else if (idx === selectedAns) {
                  bg = 'rgba(239,68,68,0.35)';
                  borderColor = 'var(--red)';
                  textColor = '#ffffff';
                  boxShadow = `0 4px 20px rgba(239,68,68,0.4)`;
                  animation = 'wrongShake 0.5s';
                } else {
                  bg = 'rgba(0,0,0,0.25)';
                  borderColor = 'rgba(255,255,255,0.1)';
                  textColor = 'rgba(255,255,255,0.5)';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={ansState !== null}
                  onClick={() => handleSelect(idx)}
                  style={{
                    position: 'relative',
                    padding: isMobile ? '16px 12px' : '24px', fontSize: isMobile ? '1.02rem' : '1.1rem', borderRadius: 'var(--r-md)',
                    background: bg, border: `2px solid ${borderColor}`,
                    color: textColor,
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px',
                    transition: 'all 0.2s', cursor: ansState !== null ? 'default' : 'pointer',
                    animation: animation,
                    backdropFilter: 'blur(16px)',
                    boxShadow: boxShadow,
                  }}
                  onMouseOver={(e) => {
                    if (ansState === null) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (ansState === null) {
                      e.currentTarget.style.background = bg;
                      e.currentTarget.style.borderColor = borderColor;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = boxShadow;
                    }
                  }}
                >
                  <div style={{
                    width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#ffffff', fontSize: isMobile ? '0.8rem' : '0.9rem',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                  }}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </div>
                  <span style={{ flex: 1 }}>{ans}</span>
                  
                  {/* Floating XP Animation */}
                  {showXP && selectedAns === idx && (
                    <div style={{
                      position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                      color: idx === currentQ.correctIndex ? 'var(--green)' : 'var(--gold)',
                      fontWeight: 'bold', fontSize: '1.3rem',
                      textShadow: '0 2px 6px rgba(0,0,0,0.5)', pointerEvents: 'none',
                      animation: 'floatingXP 1.5s ease-out forwards', whiteSpace: 'nowrap',
                      zIndex: 10
                    }}>
                      +{xpGained} ⭐
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
