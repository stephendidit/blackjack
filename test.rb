deck = []
symbols = ['h','s','c','d']
values = [['a',1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],['j',10],['q',10],['k',10]]

i = 0
symbols.each do |s| # for each symbol
  puts "s is #{s}"
  values.each do |v| # for each value
    puts "v is #{v}"
    deck[i] = [] # make an array for the new card
    deck[i][0] = s + v[0].to_s # the array's first element = symbol + value[0]
    deck[i][1] = v[1] # the array's second element = value[1]
    i += 1 # increase the index
  # #console.log(deck[i]);
  end
end

puts deck.inspect