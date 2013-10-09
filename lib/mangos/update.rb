class Mangos::Update
  attr_reader :mangos
  attr_accessor :books

  def initialize(mangos)
    @mangos = mangos

    @directories = mangos.root_path.descendant_directories.reject { |p| p.basename.to_s[0..0] == '.' }
    @books = []
    #load_data
    process
    save_data
  end

  def load_data
    self.books = (Mangos::Mangos.load_json(mangos.mangos_path + "data.json") || []).map { |b| Mangos::Book.from_hash(mangos, b) }
  end

  def save_data
    puts "\nWriting out JSON file"
    Mangos::Mangos.save_json(mangos.mangos_path + "data.json", books.map { |b| b.to_hash })
  end

  def process
    @directories.each_with_index do |d, i|
      $stdout.write "\rProcessing #{i + 1} of #{@directories.length} (#{(((i + 1) / @directories.length.to_f) * 100.0).round}%)"
      $stdout.flush

      created d
    end
    #handle deleted first
    #@directories.each do |d|
    #  puts "d: #{d.inspect}"
    #  book = books.find { |b| b.path == d }
    #  if book
    #    updated(book)
    #  else
    #    created(d)
    #  end
    #end
  end

  def deleted
    #
  end

  def created(directory)
    book = Mangos::Book.new(mangos)
    book.path = directory
    book.generate_thumbnail
    books << book
  end

  def updated(book)
    puts "updating: #{book.inspect}"
    #
  end
end
