class Mangos::Update
  attr_reader :mangos
  attr_accessor :books

  def initialize(mangos)
    @mangos = mangos

    @directories = mangos.root_path.children.reject { |p| p.basename.to_s[0..0] == '.' || p == mangos.mangos_path }
    load_data
    process
    save_data
  end

  def load_data
    self.books = (Mangos::Mangos.load_json(mangos.mangos_path + "data.json") || []).map { |b| Mangos::Book.from_hash(mangos, b) }
  end

  def save_data
    Mangos::Mangos.save_json(mangos.mangos_path + "data.json", books.map { |b| b.to_hash })
  end

  def process
    #handle deleted first
    @directories.each do |d|
      puts "d: #{d.inspect}"
      book = books.find { |b| b.path == d }
      if book
        updated(book)
      else
        created(d)
      end
    end
  end

  def deleted
    #
  end

  def created(directory)
    puts "creating: #{directory}"
    book = Mangos::Book.new(mangos)
    book.path = directory
    books << book
  end

  def updated(book)
    puts "updating: #{book.inspect}"
    #
  end
end
