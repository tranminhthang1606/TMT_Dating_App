import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

// Cấu hình
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_SERVICE_ROLE_KEY!;
const PASSWORD = "password";

// Khởi tạo Supabase client với khóa vai trò dịch vụ
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Dữ liệu hồ sơ giả
const fakeProfiles = [
    {
        full_name: "Nguyễn Thị Mai",
        username: "mai_nguyen",
        email: "mai.nguyen@example.com",
        gender: "female" as const,
        birthdate: "1995-03-15",
        bio: "Yêu thích leo núi, cà phê, và những cuộc trò chuyện thú vị. Tìm người để cùng khám phá thế giới! 🌍",
        avatar_url: " ",
        preferences: {
            age_range: { min: 25, max: 35 },
            distance: 50,
            gender_preference: ["male"],
        },
    },
    {
        full_name: "Trần Văn Nam",
        username: "nam_tran",
        email: "nam.tran@example.com",
        gender: "male" as const,
        birthdate: "1992-07-22",
        bio: "Đam mê nhiếp ảnh và du lịch. Luôn sẵn sàng cho một cuộc phiêu lưu! 📸✈️",
        avatar_url:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 28, max: 38 },
            distance: 30,
            gender_preference: ["female"],
        },
    },
    {
        full_name: "Lê Thu Hằng",
        username: "hang_le",
        email: "hang.le@example.com",
        gender: "female" as const,
        birthdate: "1990-11-08",
        bio: "Yêu sách và đam mê yoga. Tìm kiếm một người coi trọng sự phát triển bản thân và những cuộc trò chuyện ý nghĩa. 📚🧘‍♀️",
        avatar_url:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 30, max: 40 },
            distance: 25,
            gender_preference: ["male"],
        },
    },
    {
        full_name: "Hoàng Văn Tuấn",
        username: "tuan_hoang",
        email: "tuan.hoang@example.com",
        gender: "male" as const,
        birthdate: "1988-05-12",
        bio: "Người đam mê công nghệ và yêu thích thể dục. Tìm người để chia sẻ những chuyến phiêu lưu và đồ ăn ngon! 💻🏋️‍♂️",
        avatar_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 25, max: 35 },
            distance: 40,
            gender_preference: ["female"],
        },
    },
    {
        full_name: "Phạm Thu Thảo",
        username: "thao_pham",
        email: "thao.pham@example.com",
        gender: "female" as const,
        birthdate: "1993-09-18",
        bio: "Họa sĩ và nghiện cà phê. Thích khám phá những địa điểm mới và gặp gỡ những người thú vị. 🎨☕",
        avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 26, max: 36 },
            distance: 35,
            gender_preference: ["male"],
        },
    },
    {
        full_name: "Đặng Minh Quân",
        username: "quan_dang",
        email: "quan.dang@example.com",
        gender: "male" as const,
        birthdate: "1989-12-03",
        bio: "Nhạc sĩ và người yêu thiên nhiên. Chỉ cần guitar, leo núi, và những rung cảm tốt! 🎸🏔️",
        avatar_url:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 24, max: 34 },
            distance: 45,
            gender_preference: ["female"],
        },
    },
    {
        full_name: "Phan Thị Lan",
        username: "lan_phan",
        email: "lan.phan@example.com",
        gender: "female" as const,
        birthdate: "1994-02-28",
        bio: "Tín đồ ẩm thực và blogger du lịch. Luôn săn lùng những nhà hàng ngon nhất và những địa điểm ẩn mình! 🍕✈️",
        avatar_url:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 27, max: 37 },
            distance: 30,
            gender_preference: ["male"],
        },
    },
    {
        full_name: "Trương Quang Hải",
        username: "hai_truong",
        email: "hai.truong@example.com",
        gender: "male" as const,
        birthdate: "1991-06-14",
        bio: "Doanh nhân và huấn luyện viên thể hình. Đam mê giúp đỡ người khác đạt được mục tiêu của họ! 💪🚀",
        avatar_url:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 25, max: 35 },
            distance: 50,
            gender_preference: ["female"],
        },
    },
    {
        full_name: "Ngô Ánh Tuyết",
        username: "tuyet_ngo",
        email: "tuyet.ngo@example.com",
        gender: "female" as const,
        birthdate: "1996-08-07",
        bio: "Giáo viên dạy nhảy và người đam mê thể dục. Thích lan tỏa sự tích cực và năng lượng tốt! 💃✨",
        avatar_url:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 23, max: 33 },
            distance: 25,
            gender_preference: ["male"],
        },
    },
    {
        full_name: "Đỗ Gia Hưng",
        username: "hung_do",
        email: "hung.do@example.com",
        gender: "male" as const,
        birthdate: "1987-04-25",
        bio: "Kỹ sư phần mềm và người đam mê trò chơi cờ bàn. Tìm người để chia sẻ những cuộc phiêu lưu 'nerd' cùng nhau! 👨‍💻🎲",
        avatar_url:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        preferences: {
            age_range: { min: 26, max: 36 },
            distance: 40,
            gender_preference: ["female"],
        },
    },
];

async function createFakeProfiles() {
    console.log("🚀 Bắt đầu tạo hồ sơ giả...");

    for (let i = 0; i < fakeProfiles.length; i++) {
        const profile = fakeProfiles[i];

        try {
            console.log(`\n📝 Tạo hồ sơ ${i + 1}/10: ${profile.full_name}`);

            // 1. Kiểm tra xem người dùng xác thực đã tồn tại chưa
            const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
            const existingAuthUser = existingAuthUsers.users.find(
                (u) => u.email === profile.email
            );

            let userId: string;

            if (existingAuthUser) {
                console.log(
                    `⚠️ Người dùng xác thực đã tồn tại cho ${profile.full_name}, sử dụng người dùng đã có...`
                );
                userId = existingAuthUser.id;
            } else {
                // Tạo người dùng xác thực mới
                const { data: authData, error: authError } =
                    await supabase.auth.admin.createUser({
                        email: profile.email,
                        password: PASSWORD,
                        email_confirm: true, // Tự động xác nhận email
                        user_metadata: {
                            full_name: profile.full_name,
                            username: profile.username,
                        },
                    });

                if (authError) {
                    console.error(
                        `❌ Lỗi khi tạo người dùng xác thực cho ${profile.full_name}:`,
                        authError
                    );
                    continue;
                }

                userId = authData.user.id;
                console.log(`✅ Đã tạo người dùng xác thực: ${userId}`);
            }

            // 2. Kiểm tra xem hồ sơ người dùng đã tồn tại chưa
            const { data: existingProfile } = await supabase
                .from("users")
                .select("id")
                .eq("id", userId)
                .single();

            if (existingProfile) {
                console.log(
                    `⚠️ Hồ sơ đã tồn tại cho ${profile.full_name}, đang cập nhật...`
                );

                // Cập nhật hồ sơ hiện có với dữ liệu mới
                const { error: updateError } = await supabase
                    .from("users")
                    .update({
                        full_name: profile.full_name,
                        username: profile.username,
                        email: profile.email,
                        gender: profile.gender,
                        birthdate: profile.birthdate,
                        bio: profile.bio,
                        avatar_url: profile.avatar_url,
                        preferences: profile.preferences,
                        location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }),
                        location_lng: faker.location.longitude({
                            min: -122.5,
                            max: -122.4,
                        }),
                        is_verified: true,
                        is_online: Math.random() > 0.5,
                    })
                    .eq("id", userId);

                if (updateError) {
                    console.error(
                        `❌ Lỗi khi cập nhật hồ sơ cho ${profile.full_name}:`,
                        updateError
                    );
                    continue;
                }
            } else {
                // Chèn dữ liệu hồ sơ người dùng mới
                const { error: profileError } = await supabase.from("users").insert({
                    id: userId,
                    full_name: profile.full_name,
                    username: profile.username,
                    email: profile.email,
                    gender: profile.gender,
                    birthdate: profile.birthdate,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                    preferences: profile.preferences,
                    location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }),
                    location_lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
                    is_verified: true,
                    is_online: Math.random() > 0.5,
                });

                if (profileError) {
                    console.error(
                        `❌ Lỗi khi tạo hồ sơ cho ${profile.full_name}:`,
                        profileError
                    );
                    // Thử dọn dẹp người dùng xác thực nếu việc tạo hồ sơ thất bại
                    await supabase.auth.admin.deleteUser(userId);
                    continue;
                }
            }

            console.log(`✅ Đã tạo hồ sơ thành công cho ${profile.full_name}`);
            console.log(`   📧 Email: ${profile.email}`);
            console.log(`   🔑 Mật khẩu: ${PASSWORD}`);
            console.log(`   👤 Tên người dùng: ${profile.username}`);
        } catch (error) {
            console.error(
                `❌ Lỗi không mong đợi khi tạo hồ sơ cho ${profile.full_name}:`,
                error
            );
        }
    }

}

// Chạy script
createFakeProfiles().catch(console.error);