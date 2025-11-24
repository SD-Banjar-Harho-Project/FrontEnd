import pool from "../config/database.js";

class SchoolProfile {
  static async get() {
    const [rows] = await pool.execute(`SELECT * FROM school_profiles LIMIT 1`);
    return rows[0];
  }

  static async update(profileData) {
    const {
      school_name,
      npsn, // nullable
      address, // nullable
      city, // nullable
      province, // nullable
      postal_code, // nullable
      phone, // nullable
      fax, // nullable
      email, // nullable
      website, // nullable
      logo, // nullable
      favicon, // nullable
      vision, // nullable
      mission, // nullable
      goals, // nullable
      established_year, // nullable
      accreditation, // nullable
      principal_name, // nullable
      principal_photo, // nullable
      latitude, // nullable
      longitude, // nullable
      facebook_url, // nullable
      instagram_url, // nullable
      twitter_url, // nullable
      youtube_url, // nullable
      meta_title, // nullable
      meta_description, // nullable
      meta_keywords, // nullable
      is_active,
    } = profileData;

    // Check if profile exists
    const existing = await this.get();

    if (existing) {
      // Update
      await pool.execute(
        `UPDATE school_profiles SET
          school_name = ?,
          npsn = ?,
          address = ?,
          city = ?,
          province = ?,
          postal_code = ?,
          phone = ?,
          fax = ?,
          email = ?,
          website = ?,
          logo = ?,
          favicon = ?,
          vision = ?,
          mission = ?,
          goals = ?,
          established_year = ?,
          accreditation = ?,
          principal_name = ?,
          principal_photo = ?,
          latitude = ?,
          longitude = ?,
          facebook_url = ?,
          instagram_url = ?,
          twitter_url = ?,
          youtube_url = ?,
          meta_title = ?,
          meta_description = ?,
          meta_keywords = ?,
          is_active = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          school_name,
          npsn || null, // nullable
          address || null, // nullable
          city || null, // nullable
          province || null, // nullable
          postal_code || null, // nullable
          phone || null, // nullable
          fax || null, // nullable
          email || null, // nullable
          website || null, // nullable
          logo || null, // nullable
          favicon || null, // nullable
          vision || null, // nullable
          mission || null, // nullable
          goals || null, // nullable
          established_year || null, // nullable
          accreditation || null, // nullable
          principal_name || null, // nullable
          principal_photo || null, // nullable
          latitude || null, // nullable
          longitude || null, // nullable
          facebook_url || null, // nullable
          instagram_url || null, // nullable
          twitter_url || null, // nullable
          youtube_url || null, // nullable
          meta_title || null, // nullable
          meta_description || null, // nullable
          meta_keywords || null, // nullable
          is_active !== undefined ? is_active : 1,
          existing.id,
        ]
      );
    } else {
      // Insert
      await pool.execute(
        `INSERT INTO school_profiles (
          school_name, npsn, address, city, province, postal_code, phone, fax,
          email, website, logo, favicon, vision, mission, goals, established_year,
          accreditation, principal_name, principal_photo, latitude, longitude,
          facebook_url, instagram_url, twitter_url, youtube_url,
          meta_title, meta_description, meta_keywords, is_active,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          school_name,
          npsn || null, // nullable
          address || null, // nullable
          city || null, // nullable
          province || null, // nullable
          postal_code || null, // nullable
          phone || null, // nullable
          fax || null, // nullable
          email || null, // nullable
          website || null, // nullable
          logo || null, // nullable
          favicon || null, // nullable
          vision || null, // nullable
          mission || null, // nullable
          goals || null, // nullable
          established_year || null, // nullable
          accreditation || null, // nullable
          principal_name || null, // nullable
          principal_photo || null, // nullable
          latitude || null, // nullable
          longitude || null, // nullable
          facebook_url || null, // nullable
          instagram_url || null, // nullable
          twitter_url || null, // nullable
          youtube_url || null, // nullable
          meta_title || null, // nullable
          meta_description || null, // nullable
          meta_keywords || null, // nullable
          is_active !== undefined ? is_active : 1,
        ]
      );
    }

    return this.get();
  }
}

export default SchoolProfile;
