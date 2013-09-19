class Mangos::Mangos
  def initialize(root_path)
    raise "root_path must be an instance of Pathname" unless root_path.is_a?(Pathname)

    @root_path = root_path
    @mangos_path = root_path + ".mangos/"
  end

  def update
    update_app
    Mangos::Update.new(self)
  end

  def install
    mangos_path.mkdir unless File.exists?(mangos_path)

    update_app
  end

  def update_app
    FileUtils.cp_r(Mangos::Mangos.gem_path + "app/.", mangos_path)
    FileUtils.chmod_R(0755, mangos_path)
  end

  def self.load_json(path)
    if File.exists?(path)
      JSON.parse(File.read(path))
    else
      nil
    end
  end

  def self.save_json(path, data)
    File.open(path, "w") { |f| f << data.to_json }
  end
end
