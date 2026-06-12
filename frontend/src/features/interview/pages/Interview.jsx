import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.jsx'
import { useParams } from 'react-router-dom'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    }
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="q-card">
            <div className="q-card__header" onClick={() => setOpen(!open)}>
                <span className="q-card__index">Q{index + 1}</span>
                <p className="q-card__question">{item?.question || "Question"}</p>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Intention</span>
                        <p>{item?.intention || "No intention available"}</p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                        <p>{item?.answer || "No answer available"}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">
                Day {day?.day || 0}
            </span>
            <h3 className="roadmap-day__focus">
                {day?.focus || "Focus Area"}
            </h3>
        </div>

        <ul className="roadmap-day__tasks">
            {(day?.tasks || []).map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState("technical")

    const {
        report,
        getReportById,
        loading,
        getResumePdf
    } = useInterview()

    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    // SAFE DEFAULTS
    const technicalQuestions = report?.technicalQuestions || []
    const behavioralQuestions = report?.behavioralQuestions || []
    const preparationPlan = report?.preparationPlan || []
    const skillGaps = report?.skillGaps || []
    const matchScore = report?.matchScore || 0

    const scoreColor =
        matchScore >= 80
            ? "score--high"
            : matchScore >= 60
                ? "score--mid"
                : "score--low"

    return (
        <div className="interview-page">
            <div className="interview-layout">

                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? "interview-nav__item--active"
                                        : ""
                                }`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="button primary-button"
                    >
                        Download Resume
                    </button>
                </nav>

                <main className="interview-content">

                    {activeNav === "technical" && (
                        <section>
                            <div className="content-header">
                                <h2>Technical Questions</h2>
                                <span>
                                    {technicalQuestions.length} questions
                                </span>
                            </div>

                            {technicalQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                />
                            ))}
                        </section>
                    )}

                    {activeNav === "behavioral" && (
                        <section>
                            <div className="content-header">
                                <h2>Behavioral Questions</h2>
                                <span>
                                    {behavioralQuestions.length} questions
                                </span>
                            </div>

                            {behavioralQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                />
                            ))}
                        </section>
                    )}

                    {activeNav === "roadmap" && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span>
                                    {preparationPlan.length}-day plan
                                </span>
                            </div>

                            {preparationPlan.map((day, i) => (
                                <RoadMapDay
                                    key={i}
                                    day={day}
                                />
                            ))}
                        </section>
                    )}

                </main>

                <aside className="interview-sidebar">

                    <div className="match-score">
                        <p>Match Score</p>

                        <div className={`match-score__ring ${scoreColor}`}>
                            <span>{matchScore}</span>
                            <span>%</span>
                        </div>
                    </div>

                    <div className="skill-gaps">
                        <p>Skill Gaps</p>

                        {(skillGaps || []).map((gap, i) => (
                            <span key={i}>
                                {gap?.skill || "Unknown Skill"}
                            </span>
                        ))}
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview