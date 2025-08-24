"use client"

import { getPotentialMatches, likeUser } from "@/lib/actions/matches"
import { useEffect, useState, useRef } from "react"
import type { UserProfile } from "../profile/page"
import { useRouter } from "next/navigation"
import MatchCard from "@/app/components/matches/MatchCard"
import MatchButtons from "@/app/components/matches/MatchButtons"
import MatchNotification from "@/app/components/matches/MatchNotification"
import { gsap } from "gsap"
import { Power2 } from "gsap/all"

export default function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [showMatchNotification, setShowMatchNotification] = useState(false)
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null)

  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // useEffect để tải dữ liệu
  useEffect(() => {
    async function loadUsers() {
      try {
        const potentialMatchesData = await getPotentialMatches()
        setPotentialMatches(potentialMatchesData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // useEffect để chạy GSAP animation khi `currentIndex` thay đổi
  useEffect(() => {
    if (!loading && potentialMatches.length > 0 && cardRef.current && headerRef.current) {
      const tl = gsap.timeline({
        defaults: { ease: Power2.easeOut },
      })

      gsap.set(cardRef.current, { x: 0, rotation: 0 })

      // Hiệu ứng xuất hiện ban đầu cho toàn trang
      tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }).fromTo(
        cardRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "<0.2",
      )
    }
  }, [loading, potentialMatches, currentIndex])

  const animateCardOut = (direction: "left" | "right", onCompleteCallback: () => void) => {
    if (cardRef.current) {
      const tl = gsap.timeline()
      const x = direction === "right" ? 500 : -500
      const rotation = direction === "right" ? 15 : -15

      tl.to(cardRef.current, {
        x,
        rotation,
        opacity: 0,
        duration: 0.5,
        ease: Power2.easeIn,
        onComplete: onCompleteCallback,
      })
    }
  }

  // Hàm xử lý khi vuốt/bấm nút Like
  async function handleLike() {
    if (currentIndex < potentialMatches.length) {
      const likedUser = potentialMatches[currentIndex]

      animateCardOut("right", async () => {
        try {
          const result = await likeUser(likedUser.id)
          if (result.isMatch) {
            setMatchedUser(result.matchedUser!)
            setShowMatchNotification(true)
          }
          setCurrentIndex((prev) => prev + 1)
        } catch (err) {
          console.error(err)
        }
      })
    }
  }

  // Hàm xử lý khi vuốt/bấm nút Pass
  function handlePass() {
    if (currentIndex < potentialMatches.length) {
      animateCardOut("left", () => {
        setCurrentIndex((prev) => prev + 1)
      })
    }
  }

  const handleCloseMatchNotification = () => {
    setShowMatchNotification(false)
    setMatchedUser(null)
  }

  const handleStartChat = () => {
    setShowMatchNotification(false)
    if (matchedUser) {
      // Logic để chuyển hướng đến trang chat
      // router.push(`/chat/${matchedUser.id}`);
      console.log(`Starting chat with ${matchedUser.full_name}`)
    }
    setMatchedUser(null)
  }

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500  mx-auto"></div>
          <p className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Đang tìm kiếm...</p>
        </div>
      </div>
    )
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <div className="h-full mt-24 bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💕</span>
          </div>
          <h2 className="text-2xl font-bold  mb-4">Không còn hồ sơ nào</h2>
          <p className="text-gray-600 mb-6">Hãy quay lại sau, hoặc thử thay đổi sở thích của bạn!</p>
          <button
            onClick={() => router.refresh()}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          >
            Tải lại
          </button>
        </div>
        {showMatchNotification && matchedUser && (
          <MatchNotification match={matchedUser} onClose={handleCloseMatchNotification} onStartChat={handleStartChat} />
        )}
      </div>
    )
  }

  const currentPotentialMatch = potentialMatches[currentIndex]

  // Định nghĩa hàm onSwipe và onReset để truyền xuống MatchCard
  const handleSwipeFromCard = (direction: "left" | "right") => {
    if (direction === "right") {
      handleLike()
    } else {
      handlePass()
    }
  }
  const handleResetFromCard = () => {
    // Logic để reset animation nếu cần, trong trường hợp này không cần làm gì
  }

  return (
    <div className="h-full pt-24 pb-8 flex flex-col items-center ">
      <div>
        <header ref={headerRef} className="mb-8 opacity-0">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Tìm kiếm Match</h1>
            <p className="">
              {currentIndex + 1} / {potentialMatches.length} hồ sơ
            </p>
          </div>
        </header>

        <div className="flex-grow flex items-center justify-center w-full min-w-sm px-4">
          <div ref={cardRef} className="w-full">
            <MatchCard user={currentPotentialMatch} />
          </div>
        </div>

        <div className="mt-8 px-4">
          <MatchButtons onLike={handleLike} onPass={handlePass} />
        </div>

        {showMatchNotification && matchedUser && (
          <MatchNotification match={matchedUser} onClose={handleCloseMatchNotification} onStartChat={handleStartChat} />
        )}
      </div>
    </div>
  )
}
