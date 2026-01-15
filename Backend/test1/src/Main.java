import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        int[] x ={1,2,3,4,5,6,7,8,9,10};
        int[] arr=new Random().ints(1000_0000,0,1000000).toArray();
        Arrays.sort(arr);
        long initial=System.currentTimeMillis();
        for (int i = 0; i < 100; i++) {
            SecureRandom secureRandom=new SecureRandom();
            Arrays.binarySearch(arr,secureRandom.nextInt());
        }
        long end=System.currentTimeMillis();
        System.out.println(end-initial);
    }
}