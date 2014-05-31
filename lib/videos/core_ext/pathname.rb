class Pathname
  def descendant_files
    out = children.select { |p| p.video? && !p.hidden? }
    children.select { |p| p.directory? && !p.hidden? }.each do |p|
      out += p.descendant_files
    end
    out
  end

  VIDEO_EXTS = %w(.mp4 .mkv .flv .avi .m4v .mov .wmv .mpg .webm)

  def video?
    file? && extname && VIDEO_EXTS.any? { |t| extname.downcase.start_with?(t) }
  end

  def hidden?
    basename.to_s[0..0] == "."
  end
end
