import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

// Cấu hình
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_SERVICE_ROLE_KEY!;
const PASSWORD = "password";

// Khởi tạo Supabase client với khóa vai trò dịch vụ
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Hàm tạo email hợp lệ từ tên
function generateValidEmail(fullName: string, index: number): string {
    // Loại bỏ dấu tiếng Việt và ký tự đặc biệt
    const normalizedName = fullName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
        .replace(/[^a-zA-Z0-9\s]/g, '') // Chỉ giữ chữ cái, số và khoảng trắng
        .replace(/\s+/g, '') // Loại bỏ khoảng trắng
        .toLowerCase();
    
    return `${normalizedName}${index}@example.com`;
}

// Tạo 100 fake profiles đa dạng
function generateFakeProfiles(count: number = 100) {
    const profiles = [];
    const vietnameseNames = [
        // Female names
        "Nguyễn Thị Mai", "Lê Thu Hằng", "Phạm Thu Thảo", "Phan Thị Lan", "Ngô Ánh Tuyết",
        "Trần Thị Hoa", "Hoàng Thị Nga", "Đặng Thị Dung", "Vũ Thị Hương", "Lý Thị Trang",
        "Bùi Thị Linh", "Đỗ Thị Ngọc", "Hồ Thị Anh", "Dương Thị Bích", "Tô Thị Cẩm",
        "Lưu Thị Diễm", "Châu Thị Hạnh", "Tạ Thị Kiều", "Lâm Thị Loan", "Mai Thị Mỹ",
        "Võ Thị Nhung", "Hà Thị Oanh", "Phùng Thị Phương", "Quách Thị Quỳnh", "Sử Thị Thủy",
        "Tăng Thị Uyên", "Uông Thị Vân", "Vương Thị Xuân", "Yên Thị Yến", "Zương Thị Zinh",
        
        // Male names
        "Trần Văn Nam", "Hoàng Văn Tuấn", "Đặng Minh Quân", "Trương Quang Hải", "Đỗ Gia Hưng",
        "Nguyễn Văn An", "Lê Văn Bình", "Phạm Văn Cường", "Phan Văn Dũng", "Ngô Văn Em",
        "Vũ Văn Phúc", "Lý Văn Giang", "Bùi Văn Hùng", "Đỗ Văn Ích", "Hồ Văn Khoa",
        "Dương Văn Long", "Tô Văn Minh", "Lưu Văn Nghĩa", "Châu Văn Phát", "Tạ Văn Quân",
        "Lâm Văn Sinh", "Mai Văn Tân", "Võ Văn Uy", "Hà Văn Vinh", "Phùng Văn Xuân",
        "Quách Văn Yên", "Sử Văn Zương", "Tăng Văn Anh", "Uông Văn Bảo", "Vương Văn Cảnh"
    ];

    const bios = [
        "Yêu thích leo núi, cà phê, và những cuộc trò chuyện thú vị. Tìm người để cùng khám phá thế giới! 🌍",
        "Đam mê nhiếp ảnh và du lịch. Luôn sẵn sàng cho một cuộc phiêu lưu! 📸✈️",
        "Yêu sách và đam mê yoga. Tìm kiếm một người coi trọng sự phát triển bản thân và những cuộc trò chuyện ý nghĩa. 📚🧘‍♀️",
        "Người đam mê công nghệ và yêu thích thể dục. Tìm người để chia sẻ những chuyến phiêu lưu và đồ ăn ngon! 💻🏋️‍♂️",
        "Họa sĩ và nghiện cà phê. Thích khám phá những địa điểm mới và gặp gỡ những người thú vị. 🎨☕",
        "Nhạc sĩ và người yêu thiên nhiên. Chỉ cần guitar, leo núi, và những rung cảm tốt! 🎸🏔️",
        "Tín đồ ẩm thực và blogger du lịch. Luôn săn lùng những nhà hàng ngon nhất và những địa điểm ẩn mình! 🍕✈️",
        "Doanh nhân và huấn luyện viên thể hình. Đam mê giúp đỡ người khác đạt được mục tiêu của họ! 💪🚀",
        "Giáo viên dạy nhảy và người đam mê thể dục. Thích lan tỏa sự tích cực và năng lượng tốt! 💃✨",
        "Kỹ sư phần mềm và người đam mê trò chơi cờ bàn. Tìm người để chia sẻ những cuộc phiêu lưu 'nerd' cùng nhau! 👨‍💻🎲",
        "Yêu thích đọc sách và viết blog. Tìm kiếm những cuộc trò chuyện sâu sắc và ý nghĩa. 📖✍️",
        "Đam mê bóng đá và thể thao. Luôn tìm kiếm người để cùng xem trận đấu và chia sẻ niềm vui! ⚽🏆",
        "Nghệ sĩ và người yêu âm nhạc. Thích khám phá những giai điệu mới và chia sẻ cảm xúc qua âm nhạc. 🎵🎤",
        "Đầu bếp nghiệp dư và tín đồ ẩm thực. Luôn tìm kiếm những công thức mới và người để cùng nấu ăn! 👨‍🍳🍳",
        "Nhà thiết kế và người yêu nghệ thuật. Thích tạo ra những điều đẹp đẽ và khám phá sự sáng tạo! 🎨✨",
        "Bác sĩ và người yêu thiên nhiên. Tìm kiếm sự cân bằng giữa công việc và cuộc sống! 👩‍⚕️🌿",
        "Giáo viên và người yêu trẻ em. Thích chia sẻ kiến thức và tạo ra những khoảnh khắc ý nghĩa! 👩‍🏫📚",
        "Kỹ sư xây dựng và người yêu kiến trúc. Đam mê tạo ra những công trình đẹp và bền vững! 🏗️🏛️",
        "Nhà báo và người yêu viết lách. Luôn tìm kiếm những câu chuyện thú vị để chia sẻ! 📰✍️",
        "Luật sư và người yêu công lý. Tìm kiếm sự công bằng và những giá trị đạo đức! ⚖️🕊️",
        "Nhà khoa học và người yêu nghiên cứu. Đam mê khám phá những bí ẩn của vũ trụ! 🔬🌌",
        "Nghệ sĩ múa và người yêu nghệ thuật biểu diễn. Thích thể hiện cảm xúc qua chuyển động! 💃🎭",
        "Nhà văn và người yêu văn chương. Tìm kiếm cảm hứng từ cuộc sống và con người! 📝📖",
        "Nhà thơ và người yêu thi ca. Thích sử dụng ngôn từ để diễn tả cảm xúc! ✍️🌹",
        "Nhiếp ảnh gia và người yêu nghệ thuật. Đam mê bắt trọn những khoảnh khắc đẹp! 📸🎨",
        "Nhạc công và người yêu âm nhạc cổ điển. Thích tạo ra những giai điệu du dương! 🎻🎼",
        "Vũ công và người yêu khiêu vũ. Đam mê thể hiện cảm xúc qua chuyển động! 💃🕺",
        "Họa sĩ và người yêu hội họa. Thích tạo ra những tác phẩm nghệ thuật độc đáo! 🎨🖼️",
        "Nhà điêu khắc và người yêu nghệ thuật 3D. Đam mê tạo hình từ đất sét và đá! 🗿✨",
        "Nghệ sĩ graffiti và người yêu nghệ thuật đường phố. Thích tạo ra những tác phẩm công cộng! 🎨🏙️"
    ];

    const avatarUrls = [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    ];

    for (let i = 0; i < count; i++) {
        const fullName = vietnameseNames[i % vietnameseNames.length];
        const isFemale = fullName.includes("Thị");
        const gender = isFemale ? "female" : "male";
        
        // Tạo username từ tên (loại bỏ dấu)
        const nameParts = fullName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
            .split(" ");
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts[1] || nameParts[0];
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${faker.number.int({ min: 1, max: 999 })}`;

        // Tạo email hợp lệ
        const email = generateValidEmail(fullName, i + 1);

        // Tạo birthdate (18-45 tuổi)
        const age = faker.number.int({ min: 18, max: 45 });
        const birthYear = new Date().getFullYear() - age;
        const birthMonth = faker.number.int({ min: 1, max: 12 });
        const birthDay = faker.number.int({ min: 1, max: 28 });
        const birthdate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

        // Tạo preferences
        const ageRange = {
            min: Math.max(18, age - 5),
            max: Math.min(60, age + 10)
        };

        const genderPreference = isFemale ? ["male"] : ["female"];
        if (Math.random() > 0.7) {
            genderPreference.push("other");
        }

        const profile = {
            full_name: fullName,
            username: username,
            email: email,
            gender: gender as "male" | "female",
            birthdate: birthdate,
            bio: bios[i % bios.length],
            avatar_url: avatarUrls[i % avatarUrls.length],
            preferences: {
                age_range: ageRange,
                distance: faker.number.int({ min: 10, max: 100 }),
                gender_preference: genderPreference,
            },
            is_verified: Math.random() > 0.3, // 70% verified
            is_online: Math.random() > 0.6, // 40% online
        };

        profiles.push(profile);
    }

    return profiles;
}

async function createFakeProfiles() {
    console.log("🚀 Bắt đầu tạo 100 hồ sơ giả đa dạng...");

    const fakeProfiles = generateFakeProfiles(100);

    for (let i = 0; i < fakeProfiles.length; i++) {
        const profile = fakeProfiles[i];

        try {
            console.log(`\n📝 Tạo hồ sơ ${i + 1}/100: ${profile.full_name}`);

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
                        location_lat: faker.location.latitude({ min: 10.7, max: 10.8 }), // Hà Nội
                        location_lng: faker.location.longitude({ min: 106.6, max: 106.7 }), // Hà Nội
                        is_verified: profile.is_verified,
                        is_online: profile.is_online,
                        last_active: faker.date.recent({ days: 7 }).toISOString(),
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
                    location_lat: faker.location.latitude({ min: 10.7, max: 10.8 }), // Hà Nội
                    location_lng: faker.location.longitude({ min: 106.6, max: 106.7 }), // Hà Nội
                    is_verified: profile.is_verified,
                    is_online: profile.is_online,
                    last_active: faker.date.recent({ days: 7 }).toISOString(),
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
            console.log(`   🎭 Giới tính: ${profile.gender}`);
            console.log(`   📅 Tuổi: ${new Date().getFullYear() - new Date(profile.birthdate).getFullYear()}`);
            console.log(`   ✅ Verified: ${profile.is_verified ? 'Có' : 'Không'}`);
            console.log(`   🟢 Online: ${profile.is_online ? 'Có' : 'Không'}`);

            // Thêm delay nhỏ để tránh rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(
                `❌ Lỗi không mong đợi khi tạo hồ sơ cho ${profile.full_name}:`,
                error
            );
        }
    }

    console.log("\n🎉 Hoàn thành tạo 100 hồ sơ giả!");
    console.log("📊 Thống kê:");
    console.log(`   - Tổng số hồ sơ: ${fakeProfiles.length}`);
    console.log(`   - Mật khẩu cho tất cả: ${PASSWORD}`);
    console.log(`   - Vị trí: Hà Nội, Việt Nam`);
    console.log(`   - Độ tuổi: 18-45`);
    console.log(`   - Đa dạng giới tính và sở thích`);
}

// Chạy script
createFakeProfiles().catch(console.error);